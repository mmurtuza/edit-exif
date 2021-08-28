//selector for the form
var formSelector = document.getElementById("mainForm");
var selectMain = document.getElementById("imageCont");
document.getElementById('files').addEventListener('change', handleFileSelect, false);

var form = document.querySelector('form');
form.addEventListener('submit', formdataToExif);

let tagsToShow = [271, 272, 40091, 40092, 40093, 40094, 40095, 282, 283, 305, 306, 323, 37377, 37380, 37386, 37387, 2, 4, 6, 12, 17];

//function to Read the Exif data
function handleFileSelect(evt) {
    file = evt.target.files[0];
    // console.log(file)


    var reader = new FileReader();
    reader.onloadend = function (e) {
        var exifObj = piexif.load(e.target.result);

        console.log(exifObj);

        for (let i in tagsToShow) {
            showForm(tagsToShow[i], exifObj);
        }

        submitButton();
        //old code kept for debugging 
        // for (var ifd in exifObj) {
        //     if (ifd == "thumbnail") {
        //         continue;
        //     }

        //     console.log("-" + ifd);
        //     for (var tag in exifObj[ifd]) {

        //         if (exifObj[ifd][tag] == undefined) {
        //             exifObj[ifd][tag] = '';
        //         }

        //         if (piexif.TAGS[ifd][tag]["name"].startsWith('XP')) {

        //             var name = toXPHandler(exifObj[ifd][tag]);

        //             // to stringify the unit 8 array
        //             name = new TextDecoder().decode(Uint8Array.from(name));
        //             showData(ifd, piexif.TAGS[ifd][tag]["name"], name);
        //         } else {
        //             showData(ifd, piexif.TAGS[ifd][tag]["name"], exifObj[ifd][tag]);
        //         }

        //     }
        // }


    }
    reader.readAsDataURL(file);

}


//Show the needed exif data 
let showForm = function (tag, exifObj) {
    // console.log(exifObj);
    let exifName;
    if (piexif.TAGS['0th'][tag] != undefined) {

        exifObj['0th'][tag] == undefined
            ? exifName = ''
            : exifName = exifObj['0th'][tag];

        //to stringify the unit 8 
        if (piexif.TAGS["0th"][tag]["name"].startsWith('XP')) {
            exifName = toXPHandler(exifName);
            exifName = new TextDecoder().decode(Uint8Array.from(exifName));
        }

        showData(piexif.TAGS['0th'][tag]["name"], exifName);
        console.log("0th", piexif.TAGS['0th'][tag]["name"], piexif.TAGS['0th'][tag]["type"], exifName);

    } else if (piexif.TAGS['GPS'][tag] != undefined) {

        exifObj['GPS'][tag] == undefined
            ? exifName = ''
            : exifName = exifObj['GPS'][tag];

        showData(piexif.TAGS['GPS'][tag]["name"], exifName);
        console.log("GPS", piexif.TAGS['GPS'][tag]["name"], piexif.TAGS['GPS'][tag]["type"], exifName);

    } else if (piexif.TAGS['Exif'][tag] != undefined) {

        exifObj['Exif'][tag] == undefined
            ? exifName = ''
            : exifName = exifObj['Exif'][tag];

        showData(piexif.TAGS['Exif'][tag]["name"], exifName);
        console.log("Exif", piexif.TAGS['Exif'][tag]["name"], piexif.TAGS['Exif'][tag]["type"], exifName);

    } else {
        console.log(tag);//for debugging
    }
}

// Function to add Items in the form in DOM
function showData(labelOfInput, valueOfInput) {


    // To add Labels
    var newNode = document.createElement('label');
    newNode.setAttribute("for", "" + labelOfInput);
    newNode.setAttribute("class", "form-label");
    newNode.textContent = labelOfInput;

    formSelector.appendChild(newNode);
    // To add a br tag so next element shows in a ne row 
    formSelector.appendChild(document.createElement('br'));

    //to add Input Field
    var newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.setAttribute("value", "" + valueOfInput);
    newInput.setAttribute("name", labelOfInput);

    formSelector.appendChild(newInput);

    // To add a br tag so next element shows in a ne row 
    formSelector.appendChild(document.createElement('br'));
}

// To add Submit Button at the end of the form to download the image with edited exif data
function submitButton() {
    let br = document.createElement('br');
    formSelector.appendChild(br);
    var download = document.createElement('input');
    download.type = 'submit';
    download.setAttribute("value", "Download The Image");
    download.setAttribute("name", "submit");
    formSelector.appendChild(download);
}

// To solve Error Windows file system name error in piexif.js (property name starts with XP)
function toXPHandler(arrOfAscii) {

    var newArr = []
    for (var i = 0; i < (arrOfAscii.length - 2); i++) {
        if (i % 2 == 0)
            newArr.push(arrOfAscii[i]);
    }

    return newArr;
}

//Convert Form data to object
function formdataToExif(e) {
    e.preventDefault();

    var formData = new FormData(e.target);

    console.log(formData);
    formData.forEach(function (value, key) {
        console.log(key, value);
    });

    let arr = [];


    //convert the data for windows data
    let newXPTitle = document.forms['mainForm']['XPTitle'].value;
    newXPTitle = Int8Array.from(new TextEncoder().encode(newXPTitle));
    newXPTitle.forEach((item) => arr.push(item, 0));
    newXPTitle = arr;

    arr = [];
    let newXPAuthor = document.forms['mainForm']['XPAuthor'].value;
    newXPAuthor = Int8Array.from(new TextEncoder().encode(newXPAuthor));
    newXPAuthor.forEach((item) => arr.push(item, 0));
    newXPAuthor = arr;

    arr = [];
    let newXPComment = document.forms['mainForm']['XPComment'].value;
    newXPComment = Int8Array.from(new TextEncoder().encode(newXPComment));
    newXPComment.forEach((item) => arr.push(item, 0));
    newXPComment = arr;

    arr = [];
    let newXPKeywords = document.forms['mainForm']['XPKeywords'].value;
    newXPKeywords = Int8Array.from(new TextEncoder().encode(newXPKeywords));
    newXPKeywords.forEach((item) => arr.push(item, 0));
    newXPKeywords = arr;

    arr = [];
    let newXPSubject = document.forms['mainForm']['XPSubject'].value;
    newXPSubject = Int8Array.from(new TextEncoder().encode(newXPSubject));
    newXPSubject.forEach((item) => arr.push(item, 0));
    newXPSubject = arr;

    //Extractin data from form
    let newMake = document.forms['mainForm']['Make'].value;
    let newModel = document.forms['mainForm']['Model'].value;
    let newXResolution = document.forms['mainForm']['XResolution'].value;
    let newYResolution = document.forms['mainForm']['YResolution'].value;
    let newDateTime = document.forms['mainForm']['DateTime'].value;
    let newTileLength = document.forms['mainForm']['TileLength'].value;
    let newFlashEnergy = document.forms['mainForm']['FlashEnergy'].value;
    let newSoftware = document.forms['mainForm']['Software'].value;
    let newShutterSpeedValue = document.forms['mainForm']['ShutterSpeedValue'].value;
    let newExposureBiasValue = document.forms['mainForm']['ExposureBiasValue'].value;
    let newFocalLength = document.forms['mainForm']['FocalLength'].value;
    let newGPSLatitude = document.forms['mainForm']['GPSLatitude'].value;
    let newGPSLongitude = document.forms['mainForm']['GPSLongitude'].value;
    let newGPSAltitude = document.forms['mainForm']['GPSAltitude'].value;
    let newGPSSpeedRef = document.forms['mainForm']['GPSSpeedRef'].value;
    let newGPSImgDirection = document.forms['mainForm']['GPSImgDirection'].value;


    var objectData = {};
    var zeroth = {};
    var first = {};
    var exif = {};
    var gps = {};

    zeroth[piexif.ImageIFD.Make] = newMake;
    zeroth[piexif.ImageIFD.XResolution] = newXResolution; //[72,2]
    zeroth[piexif.ImageIFD.YResolution] = newYResolution;  //[72,2]
    zeroth[piexif.ImageIFD.Software] = newSoftware; //string
    zeroth[piexif.ImageIFD.XPTitle] = newXPTitle;
    zeroth[piexif.ImageIFD.XPComment] = newXPComment;
    zeroth[piexif.ImageIFD.XPAuthor] = newXPAuthor;
    zeroth[piexif.ImageIFD.XPKeywords] = newXPKeywords;
    zeroth[piexif.ImageIFD.XPSubject] = newXPSubject;
    zeroth[piexif.ImageIFD.DateTime] = newDateTime; //"2010:10:10 10:10:10";
    zeroth[piexif.ImageIFD.TileLength] = newTileLength != '' ? parseInt(newTileLength) : ''; //int
    zeroth[piexif.ImageIFD.FlashEnergy] = newFlashEnergy != '' ? parseInt(newFlashEnergy) : ''; //int
    zeroth[piexif.ImageIFD.Model] = newModel; //string
    exif[piexif.ExifIFD.ShutterSpeedValue] = newShutterSpeedValue; //[42, 2];
    exif[piexif.ExifIFD.ExposureBiasValue] = newExposureBiasValue; //[1, 100];
    exif[piexif.ExifIFD.FocalLength] = newFocalLength;  //[22, 22];
    gps[piexif.GPSIFD.GPSLatitude] = newGPSLatitude; //[[1, 1], [1, 1], [1, 1]];
    gps[piexif.GPSIFD.GPSLongitude] = newGPSLongitude; //[[1, 1], [1, 1], [1, 1]];
    gps[piexif.GPSIFD.GPSAltitude] = newGPSAltitude; //[[1, 1], [1, 1], [1, 1]];
    gps[piexif.GPSIFD.GPSSpeedRef] = newGPSSpeedRef;
    gps[piexif.GPSIFD.GPSImgDirection] = newGPSImgDirection; //float/


    var exifObj = { "0th": zeroth, "Exif": exif, "GPS": gps };
    console.log(exifObj);
    var exifbytes = piexif.dump(exifObj);

    var reader = new FileReader();
    reader.onload = function (e) {
        var inserted = piexif.insert(exifbytes, e.target.result);


        var el = document.createElement("img");
        el.setAttribute('src', inserted);
        el.setAttribute('style', 'width:400px;');
        selectMain.appendChild(el);

        var link = document.createElement('a');
        link.href = inserted;
        link.download = 'Download.jpg';
        selectMain.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };
    reader.readAsDataURL(file);

}

// function strToArr(value) {
//     let val = value;
//     console.log(val)
//     val = Int8Array.from(new TextEncoder().encode(val));
//     let arr = [];
//     arr = val.forEach((item) => arr.push(item, 0));
//     console.log(arr)
//     return arr;
// }
