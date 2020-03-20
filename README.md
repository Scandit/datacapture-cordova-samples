# Available Samples

We have created both a simple sample and a more advanced stock count sample that show you how to capture barcodes and how to use MatrixScan functionality.
The simple sample allows you to get going quickly, while the advanced one shows you how to use some additional settings and setup the scanner ui.

## Barcode Capture Samples

|                               Simple Sample                              |
|:------------------------------------------------------------------------:|
![alt text](/images/sample-bc-simple-1.jpg?raw=true "Simple Sample") ![alt text](/images/sample-bc-simple-2.jpg?raw=true "Simple Sample") |
| Basic sample that uses the camera to read a single barcode.              |

## MatrixScan Samples

|                            Simple Sample                            |                            Stock Count Sample                            |
|:-------------------------------------------------------------------:|:------------------------------------------------------------------------:|
| ![alt text](/images/sample-ms-simple-1.jpg?raw=true "Simple Sample")![alt text](/images/sample-ms-simple-2.jpg?raw=true "Simple Sample") | ![alt text](/images/sample-ms-sc-1.jpg?raw=true "Stock Count Sample")![alt text](/images/sample-ms-sc-2.jpg?raw=true "Stock Count Sample") |
| Very simple sample which shows how you can highlight barcodes on screen. | Demonstrates a use case to count tracked codes. |

# Run the Samples

The best way to start working with the Scandit Data Capture SDK is to run one of our sample apps.

Before you can run a sample app, you need to go through a few simple steps:

  1. Clone or download the samples repository.

  2. Sign in to your Scandit account and download the newest Cordova Framework at <https://ssl.scandit.com/downloads/>. Unzip the archive and go to the `samples` folder.

  3. Set the license key. To do this, sign in to your Scandit account and find your license key at <https://ssl.scandit.com/licenses/>.

    Once you have the license key, add it to the `index.js` of the sample you'd like to run replacing the placeholder value:

    ```javascript
    Scandit.DataCaptureContext.forLicenseKey('-- ENTER YOUR SCANDIT LICENSE KEY HERE --');
    ```

  4. Create the Cordova project for the sample that you'd like to run. Make sure you always have the most recent version of Cordova installed.

    For example, to create a Cordova project for the simple Barcode Capture sample in a `helloscandit`:

    ```bash
    cordova create helloscandit --template ./BarcodeCaptureSimpleSample
    ```
  
  4. Add a platform to the Cordova project and run it.

    Once you created the Cordova project for the sample you'd like to run, navigate to the root of the project, e.g. `cd helloscandit`, and add the platform you'd like to run the sample on:

    ```bash
    cordova platform add [ios|android]
    ```

    And then run it.

    ```bash
    cordova run [ios|android] --device
    ```

# Documentation & Getting Started Guides

If you want to learn more, check the complete documentation and getting started guides [here](https://docs.scandit.com/data-capture-sdk/cordova/)
