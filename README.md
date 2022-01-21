# WebVR Chandra tours

A collection of browser-based VR tours depicting outer-space bodies, with an emphasis on data collected from the Chandra X-ray Observatory.

## Repo Contents

* A set of VR tours displaying data for:
    * Crab Nebula
    * Tycho's Supernova
    * SN 1006
    * IC 443
    * Cat's Eye nebula
* A gallery page (gallery.html) linking to all the tours
* Models, textures, and A-frame components required to display the VR data
* A template that can be used to assemble a new tour

## Installation

Clone this repo to a directory of your choice - click the green "Code" dropdown on this page, copy the HTTPS link, open Terminal (Mac) or Command Prompt (Windows), cd to the directory of your choice, and run

    git clone link-you-copied

The repo files should now be in a directory called 'gm2m-models'.

## Creating a new tour

### Prerequisites

* Models of the outer space objects that have been exported in the GLTF format - see [this repo](https://github.com/apdupuis/gltf-texture-baking) for steps to export such models from Blender.
* A set of audio files and accompanying text that narrate the different stops on the tour, with the audio preferably in mp3 format.

### 1.) Create a new tour from the template 

1. Navigate within this repo to src/Tours (this is where each tour page has its code located.) Duplicate the "template" directory, and rename it to something short and descriptive of your new tour - here we'll say "cassiopeia" for example.

2. Go into your new tour directory and rename its html file from "templateTour.html" to whatever name you just used for the directory - in our case, it would become "cassiopeia.html".

3. Open your tour's html file in your favorite text editor, like Sublime Text. We'll start by updating the page's titles to reflect our new tour - first, at the top of the page, you have

        <title>Tour template</title>

    Replace "Tour template" with the full name of your tour's subject, which in our case becomes 

        <title>Cassiopeia A</title>
    
    Similarly, we also have a splash screen that displays the title of the tour - this is located at the bottom of the page, in a line reading

        <div class="title">Tour template</div>
    
    Replace "Tour template" with your title in the same manner.

### 2.) Adding your models to the tour 

1. Add your GLTF models to src/gltf

2. Find the part of the html file where you have two enclosing "<a-assets>" tags - that's where we load in any necessary media like GLTF models, images, or audio. By default, the tour template loads in two models from the IC-443 tour - the a-asset-item lines marked with "ejecta" and "blastwave" ids. Copy and/or delete those two lines as necessary to match the number of models you'll want to load, and update their src links to point to your own model filenames. You'll also want to update the "id" field for each model, since this is what we'll use when we want to place these models in the scene. As an example, if we wanted to load in a model for the Cassiopeia jets, the line to load that model might look like:

        <a-asset-item id="jets" src="../../gltf/cassiopeia_jets.glb"></a-asset-item>
        
3. Now that we've set our page to load the models, we have to add them to the a-frame scene so we can view them. Towards the bottom of the html file, there's an example which demonstrates how the two objects from the template tour could be added to the scene:

        <a-entity
            id="IC-443"
            scale="1 1 1"
            position="0 0 0"
            rotation="0 0 0">
            
            <a-entity
                id="Ejecta"
                gltf-model="#ejecta"
                renderer="antialias: true;
                colorManagement: true;"
                render-order="nebula"
                >
            </a-entity>
            
            <a-entity
                id="Blast Wave"
                gltf-model="#blastwave"
                renderer="antialias: true;
                colorManagement: true;"
                render-order="nebula"
                >
            </a-entity>
            
        </a-entity>
        
    There's a lot going on here, but right now there are three important things when it comes to adding a model to a scene:
    
    1. When you want to add something new to an A-frame scene, you create a new "a-entity" object. (Read more about a-entities [here](https://aframe.io/docs/1.2.0/introduction/entity-component-system.html)).
    
    2. If you want that "a-entity" to display one of the models you loaded, add a "gltf-model" attribute inside its first tag, and set that equal to the model's id. Remember you gave each model an id in the asset loading step - this is where it gets used! Also note that you need to add a hashtag before the id name.
    
    3. If you want to group a set of related objects together, you can make another a-entity, and put all your model a-entity's between the parent's two tags. In the example above, we have two a-entities that load gltf models from IC-443, which are enclosed in an an empty parent entity labeled "IC-443". This lets us do things like move or resize a set of related models (the blastwave and ejecta) at once by changing the scale or position attributes of the parent.
    
    So, for example, if you have two Cassiopeia models loaded, and you set their ids to "jets" and "halo", you could update the above code to look something like: 


        <a-entity
            id="Cassiopeia"
            scale="1 1 1"
            position="0 0 0"
            rotation="0 0 0">
            
            <a-entity
                id="Jets"
                gltf-model="#jets"
                renderer="antialias: true;
                colorManagement: true;"
                render-order="nebula"
                >
            </a-entity>
            
            <a-entity
                id="Halo"
                gltf-model="#halo"
                renderer="antialias: true;
                colorManagement: true;"
                render-order="nebula"
                >
            </a-entity>
            
        </a-entity>

### 3.) Previewing the tour

1. Launch a local http server so you can view the tour(s) in your browser - navigate into the gm2m-models/src directory in Terminal (Mac) or Command Prompt (Windows), and run 

        python -m http.server
        
    See [this stackoverflow](https://stackoverflow.com/questions/27977972/how-do-i-setup-a-local-http-server-using-python) for more details, if you run into any issues.
    
2. The above command should start a server at the address localhost:8000 (8000 is the default port - if you want to change that number, add the new number at the end of the command when starting the server.) You can now view any page in gm2m-models/src by entering the address localhost:8000/path/to/page in your browser - here, to view the Cassiopeia tour, we would enter localhost:8000/Tours/cassiopeia/cassiopeia.html

3. The tour's splash screen should appear - click on the button to enter, and you should be taken on an automated tour which displays your models, along with the template text.

4. If you want to troubleshoot things on the page (generally a good idea) you'll want to open the your browser's developer tools / inspector panel. The console, in particular, should display any error messages related to the page. 

### 4.) Fine-tuning model appearance 

1. Hopefully your models are now displaying in the tour! 

    * If they are not displaying, check the console in the browser's developer tools.
    
    * If they are displaying, but look incorrect, try previewing them in the [gltf viewer](https://gltf-viewer.donmccurdy.com/). If they look drastically different than you expect, there may have been an issue exporting the GLTF.
    
    * If their scale, position, or rotation seem off, you can tweak those values - we'll cover this in the next step!
    
2. Assuming that your models are displaying, we might want to change aspects about their appearance. We've made a custom material component for these tours that provides  a number of useful transparency-related options for each model. In order to use this material, add "transparent-edge-material" to the list of attributes for each a-entity that has a GLTF model - for our jets entity, for instance, the updated entity would look like: 

        <a-entity
            id="Jets"
            gltf-model="#jets"
            renderer="antialias: true;
            colorManagement: true;"
            render-order="nebula"
            transparent-edge-material
        >
        </a-entity>
        
3. Now that we have this material added to our models, we can tweak the material settings in real-time using A-frame's own inspector. Go to the tour page in your browser, and hit ctrl-alt-i to open the A-frame inspector. This lets you manipulate the properties for the various elements in your scene in real-time - much faster than typing values directly into the html.

4. Manipulate the material settings on your models, if desired. You can select each individual model's entity in the scene hierarchy on the left. In our case, we can click on the empty parent entity for Cassiopeia, and see its children labeled Jets and Halo:

    ![A-frame scene hierarchy](/src/textures/inspector_hierarchy.jpg)
    
    If we click on the Jets entity, a menu pops up on the right side showing us the properties we can manipulate:
    
    ![A-frame properties panel](/src/textures/inspector_panel.jpg)
    
    To manipulate the material properties, open the transparent-edge-material panel towards the bottom. The available properties are:
    
    * **depthTest** (default false): Determines whether faces in front obscure faces in back. This is usually not desirable for transparent materials in OpenGL, so it's off be default.
    
    * **opaqueAngle** (default 1.0) and **transparentAngle** (default 0.0): These work together to provide view-dependent transparency, allowing you to make object edges transparent (good for nebula-type effects) or make only the edges visible (good for halo and blast-wave type effects). The view angle is a calculation of how much a face is angled towards the camera, ranging from 1.0 (fully facing the camera) to 0 (perpendicular) to -1 (facing away). In the default settings, parts of the model facing the camera would be fully opaque, since the opaqueAngle is set to 1.0, while faces perpendicular to the camera (angle 0) would be transparent. To get more of a halo effect, set opaqueAngle to near 0, and transparentAngle to something greater than 0.
    
    * **makeViewAngleSymmetric** (default true): Setting this to true recalculates the view angle in absolute terms, meaning that the angle goes from 1.0 when facing the camera, to 0 when perpendicular, and back up to 1.0 when facing away. This is useful for halo effects, where we only want to display the edges of a shape.
    
    * **side** (default double): Determines whether the model displays sides facing front, back, or both (double). It's occasionally useful to use something other than double if you're trying to troubleshoot issues related to object transparency and/or render order.
    
5. Update your html entities to include any changes you've made to the material settings. While the A-frame inspector is great for previewing new settings, it won't save them. You can specify any changes to a component's default properties on a given entity using the syntax

        <a-entity ${componentName}="${propertyName1}: ${propertyValue1}; ${propertyName2}: ${propertyValue2}">
        
    So, if we had changed our Jets material to make depthTest true and transparentAngle 0.5, we could change its entity to:
    
        <a-entity
            id="Jets"
            gltf-model="#jets"
            renderer="antialias: true;
            colorManagement: true;"
            render-order="nebula"
            transparent-edge-material="
                depthTest: true;
                transparentAngle: 0.5;
            ">
        </a-entity>
        
    Note that whitespace doesn't make a difference - here we put the properties on separate indented lines for readability.

### 5.) Adding narration to the tour

1. Assuming you have audio files for your different tour stops, add them to the "audio" folder in your tour's directory. Delete the template tour's audio if that is still in the audio folder.

2. Load these audio files into your tour's a-assets section, much like you did with the GLTF models - the tour template shows you how to load and label three audio files - replace the filenames and add new audio assets as needed. Be sure that each audio asset has a unique id.

3. Find the entity labeled "rig" on your page - this is whether the information for the specific tour stops is entered. You'll see four distinct stops by default, which are a-curve entities with ids labeled "one" through "four" - three of them have audio, and one does not. Add additional a-curve elements by copy and pasting until you have **one more** than your number of audio files - I'd recommend copying element "three" and pasting in the new entities in between "three" and "four" until you have the right number. Then, rename those ids so each stop has the correct number as its id.

4. Update the "audio" property for each a-curve's text component so that it matches the id for the correct audio asset - the first stop should have its audio property set to the first audio clip's id, and so on. So, if you have a fifth stop on the tour, at this point it might look something like:

        <a-curve id="five" tour="dur: 6000; pauseDuration: 3000; audio: audio5; text: This is the last text on the tour.">
            <a-curve-point position="0.7 -0.6 4.3"></a-curve-point>
            <a-curve-point position="-0.6 4.4 -0.4"></a-curve-point>
            <a-curve-point position="2.8 -0.5 -5.5"></a-curve-point>
        </a-curve>
        
    The last stop shouldn't have any audio or text - this stop comes up at the end of the tour, after all the narration is finished, and usually positions the camera somewhere where the viewer can see the whole model.
    
5. Update the "text" property of each component to use the text that accompanies that stop's narration.

### 6.) Updating the tour path 

1. Last but not least, you'll want to change the tour path itself to better position the viewer relative to the features being described at each stop (and in general to show off the model's good angles.) Each a-curve entity corresponding to a specific stop contains a number of a-curve-points which describe the path taken to that stop: the first point describes the starting position in 3D space when the camera begins traveling to that stop, the last a-curve-point describes where the camera stops when the narration begins, and the middle points describe the intermediate points the camera will hit on its path. You can have as few as two points per stop, and you could perhaps have many more than three, if desired.

    The main thing to keep in mind is that, if you want a smooth transition from stop to stop, the last a-curve-point of each a-curve should be the same as the first point of the next. This seems a bit redundant, and might be worth changing in the future.

    Up to now, the points for each stop's curve have, unfortunately, been put in by viewing the tour, noting whether the camera is too far [left, right, up, etc] at a particular stop, and updating the HTML property values for each a-curve-point. An inspector-based solution would be preferable, if one can be implemented.
    
2. Once you have the curve points positioned, you can update the timing of the tour points: the dur property sets the number of milliseconds each tour point takes for the camera to travel, and pauseDuration is the number of milliseconds the camera will wait at each stop. If pauseDuration is too low, audio might get cut off, so check for that when previewing the tour and adjust the pauseDuration if necessary.