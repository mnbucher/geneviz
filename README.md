# GENEVIZ
## Generation, Validation, and Visualization of SFC Packages

Bachelor's Thesis at the University of Zurich (UZH)

**Author:** Martin Juan José Bucher

*Supervisors:* Muriel Figueredo Franco, Eder John Scheid

*Date of Submission:* May 2019

Communications Systems Group, Prof. Dr. Burkhard Stiller

**Abstract**

Network Function Virtualization (NFV) aims to decouple the package processing of net- work functions from dedicated hardware appliance by running Virtualized Network Func- tions (VNFs) on general-purpose hardware. Network operators can create customized network services by chaining multiple VNFs together, forming a so-called Service Func- tion Chaining (SFC). Although NFV becomes more popular and technically mature, the construction of such SFCs still needs in-depth knowledge about NFV technology. Fur- thermore, the creation of an SFC can only be done manually up until now. In this thesis, we introduce GENEVIZ, a tool providing a user-friendly interface both for the construc- tion and generation of completely new SFCs from scratch as well as for the import and adjustment of previously created SFCs in order to create new SFCs based on existing ones. Beyond that, we address the issue of data integrity and give the possibility to validate SFCs — received from an external source — through the usage of blockchain technology. GENEVIZ aims to provide a way to create SFCs more intuitive and easier. In addition, the number of steps necessary for different use cases is reduced. We conduct three case studies on our developed prototype, not only showing the technical feasibility of GENEVIZ, but also providing evidence of the usability of the different visualizations we proposed.

This repository contains the source code for the GENEVIZ Prototype.

## Installation Guideline

This chapter provides the necessary information to install and run the components of the GENEVIZ Prototype on a computer or virtual machine with a fresh installation of Apple's macOS. Setting up the components on another operating system based on UNIX should work quite similar, for Windows the steps could differ slightly more.

### Setting up the Web Application

Setting up the User Interface of the GENEVIZ Prototype requires first the installation of the Node Package Manager (npm). The distribution of npm comes along with Node.js and can be installed from the website:

[https://www.npmjs.com/get-npm](https://www.npmjs.com/get-npm)

After navigating into the root directory of the source code, all necessary node packages defined in the ```packages.json``` file need to be installed by running the following command through the Command-Line Interface (CLI):

```
npm install
```

This should have successfully installed all node modules in the ```node_modules``` directory. As the source code of the web application is written in TypeScript, the language of the package named ```react-digraph``` needs to be manually changed to TypeScript instead of regular JavaScript by opening the following file in order to edit it:

```
node_modules/react-digraph/package.json
```

Now, the ```package.json``` file needs to appended by adding a new attribute called ```typings``` in the first hierarchy-level of the JSON in order to refer to the following path:

```json
"typings": "./typings/index.d.ts"
```

After saving the edited ```package.json``` of the react-digraph module, the web application should now be ready to be properly compiled in development mode. The development mode comes with an integrated development server on ```localhost```, which enables live reloading if the source code has changed. In favor of this, not all source code files are fully optimized. To start the development mode, run the following command through the CLI, which also shows up the respective port for the web application:

```
npm run dev
```

To compile the application in production mode, run the following command:

```
npm run build
```

### Setting up the Data Layer

In order to run the Data Layer of GENEVIZ, Python 3.7 needs to be installed first, which can be done through the Website:

[https://www.python.org/downloads/](https://www.python.org/downloads/)

After successfully installing Python 3.7, the global installation of the ```virtualenv``` package needs to be installed with the help of the Python Package Installer (pip). Pip should already be installed with the Python 3.7 distribution and can be accessed through the CLI by using ```pip```. Sometimes, the ```pip3``` command is necessary, in case that ```pip``` is not recognized as a command. The ```virtualenv``` package is installed as follows:

```
pip install virtualenv
```

Now, one needs to navigate into the subfolder ```geneviz-management-api```, where the source code for the Data Layer is located. We have put all the necessary source code for the Data Layer inside the Management API. There, a new virtual environment needs to be set up with the following command:

```
python3 -m venv venv
```

This should have created a virtual environment named ```venv```. The folder name could also be named differently by changing the last argument of the above command. Now, the virtual environment needs to be activated:

```
source venv/bin/activate
```

At this step, it should be ensured that the environment is using Python 3.7 and pip3 by checking their respective versions with the ```--version``` flag through the CLI. As a next step, the required Python packages need to be installed by running the following command:

```
pip install -r requirements.txt
```

Next, the FLASK_APP environment variable needs to be set on the local machine based on the absolute path of the ```geneviz_management_api.py``` file:

```
export FLASK_APP=absolute/path/to/geneviz_management_api.py
```

Lastly, still being in the virtual environment, Flask can finally be started with the following command:

```
flask run
```

This should have started Flask on the port given in the console log.

Due to access control checks, depending on the locations of both the web application, as well as the Management API, the respective origins of the web application need to be defined in the Management API. If ```npm run dev``` is called for the web application, running on port ```3000```, and the Management API is running on the same local machine, the communication should work properly. 

If these settings differ slightly (e.g. another port or by putting the Management API on a remote server), the respective origin of the web application may need to be set in the Management API by appending or changing the ```origins``` array on line 24 of the ```geneviz_management_api.py``` file:

```
CORS(app, resources={r"/*": {"origins": [ "http://localhost:3000"]}})
```

### Setting up Ganache
To set up Ganache on the local machine, it can simply be installed through the Website:

[https://truffleframework.com/ganache](https://truffleframework.com/ganache)

By clicking "Quickstart" after the launch of the application, a local Ethereum Blockchain is created, which can then be used for testing purposes. The respective port of Ganache can be adjusted and is seen in the application window at the top menu bar. If the Ethereum API of the GENEVIZ Prototype can't reach Ganache, the port maybe needs to be changed in the source code of the ```ethereum_api.py``` file.
