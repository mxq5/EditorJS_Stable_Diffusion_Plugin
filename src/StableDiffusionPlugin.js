import { IconAddBackground } from '@codexteam/icons';
import './index.css';

export default class StableDiffusionPlugin {
  constructor({ data, config, api, readOnly, getStableDiffusionImage }) {
    this.api = api;
    this.readOnly = readOnly;

    // Imported style
    this._CSS = {
      block: this.api.styles.block,
      wrapper: 'ce-stable-diffusion',
    };

    // Settings
    this._settings = config;

    // Data (innerHTML)
    this._data = this.normalizeData(data);

    /**
     * Main Block wrapper
     *
     * @type {HTMLElement}
     * @private
     */
    this._element = this.getTag();
    this._element?.addEventListener("keypress", async function(event) {
        // Fetch api on enter
        if (event.key === "Enter") {
            const blockData = await config.getStableDiffusionImage(this.innerText);
            console.log(blockData);
            api.blocks.delete();
            api.blocks.insert("image", blockData);
        }
    })
  }

  normalizeData(data) {
    const newData = {};
    if (typeof data !== 'object') data = {};
    newData.text = data.text || '';
    console.log(newData.text);
    return newData;
  }

  render() {
    return this._element;
  }

  /**
   * Extract Tool's data from the view
   *
   * @param {HTMLHeadingElement} toolsContent - Text tools rendered view
   * @returns {HeaderData} - saved data
   * @public
   */

  // Content that will be saved in JSON in MongoDB
  save(toolsContent) {
    return {
        text: toolsContent.innerHTML,
        // level: this.currentLevel.number,
    };
  }

  // Allow Stable diffusion to be converted to/from other blocks
  static get conversionConfig() {
    return {
      export: 'text', // use 'text' property for other blocks
      import: 'text', // fill 'text' property from other block's export string
    };
  }

  // Read only supported
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * Get current Tools`s data
   *
   * @returns {HeaderData} Current data
   * @private
   */
  
    get data() {
        this._data.text = this._element.innerHTML;
        this._data.level = this.currentLevel.number;
        return this._data;
    }

    // Disable line breaks, function will execute on press Enter
    static get enableLineBreaks() {
        return true;
    }

    set data(data) {
        this._data = this.normalizeData(data);

    /**
     * If level is set and block in DOM
     * then replace it to a new block
     */
    if (data.level !== undefined && this._element.parentNode) {
      /**
       * Create a new tag
       *
       * @type {HTMLHeadingElement}
       */
      const newHeader = this.getTag();

      /**
       * Save Block's content
       */
      newHeader.innerHTML = this._element.innerHTML;

      /**
       * Replace blocks
       */
      this._element.parentNode.replaceChild(newHeader, this._element);

      /**
       * Save new block to private variable
       *
       * @type {HTMLHeadingElement}
       * @private
       */
      this._element = newHeader;
    }

    /**
     * If data.text was passed then update block's content
     */
        if (data.text !== undefined) {
        this._element.innerHTML = this._data.text || '';
        }
    }
    
    /**
     * Get tag for target level
     * By default returns second-leveled header
     *
     * @returns {HTMLElement}
     */
    
    getTag() {
        // Create element for current Block's level
        const tag = document.createElement('p');

        // Add text to block
        tag.innerHTML = this._data.text || '';

        // Add styles class
        tag.classList.add(this._CSS.wrapper);

        // Make tag editable
        tag.contentEditable = this.readOnly ? 'false' : 'true';
        
        // Add Placeholder
        tag.dataset.placeholder = 'Type your prompt and let your imagination materialize!';

        return tag;
    }

    // Toolbox for editor JS
    static get toolbox() {
        return {
            icon: IconAddBackground,
            title: 'StableDiffusion',
        };
    }
}