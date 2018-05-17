# Create a banking chatbot for RPA
In this developer journey, we will create a chatbot using Node.js and Watson Assistant. 

### Learn how to
* Create a chatbot that converses via a web UI using Watson Assistant and Node.js

# Final State architecture. 
Currently we have created a simple chatbot but eventually we will acheive the below architecture
![](doc/source/images/architecture.png)

## Flow
1. The user interacts with a chatbot via the nodejs app UI.
2. The dialogs is hardcoded to answer specific questions but will be enhanced to use other features like Watson Conversation, database interactons as we movealong this journey.

## Included components

* [IBM Watson Assistant](https://www.ibm.com/watson/developercloud/conversation.html): Build, test and deploy a bot or virtual agent across mobile devices, messaging platforms, or even on a physical robot.

## Featured technologies
* [Node.js](https://nodejs.org/): An asynchronous event driven JavaScript runtime, designed to build scalable applications.

# Steps

## Deploy to IBM Cloud

## Run locally
> NOTE: These steps are only needed when running locally instead of using the ``Deploy to IBM Cloud`` button.

1. Clone the repo
2. Create Watson services with IBM Cloud
3. Configure credentials
4. Run the application

### 1. Clone the repo

Clone the `watson-banking-chatbot` locally. In a terminal, run:

```
$ git clone https://github.com/arunwagle/IBMRepo.git
```

We’ll be using the file [`data/conversation/workspaces/banking.json`](data/conversation/workspaces/banking.json) and the folder
[`data/conversation/workspaces/`](data/conversation/workspaces/)

### 2. Create Watson services with IBM Cloud

Create the following services:

* [**Watson Assistant**](https://console.ng.bluemix.net/catalog/services/conversation)

### 3. Import the Assistant workspace

Launch the **Watson Assistant** tool. Use the **import** icon button on the right

<p align="center">
  <img width="400" height="55" src="doc/source/images/import_conversation_workspace.png">
</p>

Find the local version of [`data/conversation/workspaces/banking.json`](data/conversation/workspaces/banking.json) and select
**Import**. Find the **Workspace ID** by clicking on the context menu of the new
workspace and select **View details**. Save this ID for later.

<p align="center">
  <img width="400" src="doc/source/images/WCSViewdetails.png">
</p>

*Optionally*, to view the conversation dialog select the workspace and choose the
**Dialog** tab, here's a snippet of the dialog:

![](doc/source/images/dialog.png)


### 5. Configure credentials

The credentials for IBM Cloud services (Assistant, Discovery, Tone Analyzer and
Natural Language Understanding), can be found in the ``Services`` menu in IBM Cloud,
by selecting the ``Service Credentials`` option for each service.

The other settings for Assistant and Discovery were collected during the
earlier setup steps (``DISCOVERY_COLLECTION_ID``, ``DISCOVERY_ENVIRONMENT_ID`` and
``WORKSPACE_ID``).

Copy the [`env.sample`](env.sample) to `.env`.

```
$ cp env.sample .env
```
Edit the `.env` file with the necessary settings.

#### `env.sample:`

```
# Replace the credentials here with your own.
# Rename this file to .env before starting the app.

# Watson conversation
CONVERSATION_USERNAME=<add_conversation_username>
CONVERSATION_PASSWORD=<add_conversation_password>
WORKSPACE_ID=<add_conversation_workspace>


# Run locally on a non-default port (default is 3000)
# PORT=3000

```

### 6. Run the application
1. Install [Node.js](https://nodejs.org/en/) runtime or NPM.
1. Start the app by running `npm install`, followed by `npm start`.
1. Use the chatbot at `localhost:3000`.
> Note: server host can be changed as required in server.js and `PORT` can be set in `.env`.

# Sample output

![](doc/source/images/sample_output.png)



