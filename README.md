# EditorJS_Stable_Diffusion_Plugin
Plugin for Editor.js that provide in-editor AI images generation

# Installation

Install required dependencies:
```Bash
npm i @codexteam/icons @editorjs/image
```

Then just import plugin

```JS
import StableDiffusionPlugin from "../path_to_stableDiffusionPlugin/StableDiffusionPlugin.js";
```

In order to use this plugin, you have to add its class to Editor.js config

```JS
const config = {
        holder: 'editorjs', 
        placeholder: "Editor.js placeholder",
        // (...)
        tools: {
            // (...)
            // Here
            stableDiffusion: {
                class: StableDiffusionPlugin,
                inlineToolbar: true,
                config: {
                    titlePlaceholder: 'Title',
                    messagePlaceholder: 'Message',
                    getStableDiffusionImage: getStableDiffusionImage
                },
            },
            // You have to also have @editorjs/image implemented correctly
            image: {
                class: ImageTool,
                config: {
                    captionPlaceholder: 'Enter a title of image',
                    endpoints: {
                        byFile: imageUploadFile,
                    }
                }
            },
            // (...)
    }
```

You have to also provide your own `getStableDiffusionImage` function, here is example:

```JS
const getStableDiffusionImage = async (prompt) => {
        console.log("Please wait a second... Stable diffusion is generating image");

        // bearerFetch is our fetch superstructure, you can use standard fetch also
        const response = await bearerfetch("/your_stable_diffusion_endpoint", 'POST', {
            steps: 20,
            prompt,
            cfg_scale: 6.5,
            negative_prompt: '',
            sampler_name: 'Euler a'
        });

        if(response.data.status !== "OK") return console.log("Stable Diffusion couldn't render an image", "Error");

        return {
            file: { url: response.data },
            caption: prompt,
        };
    }
```

The server side endpoint should use StableDiffusion api, then save the generated image to directory, response should be following JSON:

```JSON
{
    "status": "OK",
    "error": "",
    "data": `http://example.com/path_to_saved_image.png`
}
```