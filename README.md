# Alexa Fizz Buzz Game
![](ReadMeBanner.png)
Simple Alexa game created using JavaScript and Node.js in the Alexa Developer Console

## Table of Contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Design Choice](#design-choice)

## General info
This project is 

## Technologies
Project is created with:
* JavaScript
* Node.js
* Alexa Developer Console

## Setup
To run this project, open Alexa Developer Console and paste index.js into the corresponding file, other files were unchanged.
Set up the necessary intents shown in models/intents.json.

## Design Choice
* While in a game, any response other than the correct answer would lose the game to reflect the real world, including asking for instruction, similarly, no pause game function is implemented.
* Alexa will respond differently to the same utterances depending on whether in game or not.
* Skill Invocation Name is volley fizz buzz instead of fizz buzz. This is due to a built-in fizz buzz game causing confusion in the test console.
