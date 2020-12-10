# Alexa "Fizz Buzz" Game
![](images/ReadMeBanner.png)

Simple Alexa game created using JavaScript and Node.js in the Alexa Developer Console

## Table of Contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Features](#features)
* [Design Choice](#design-choice)

## General info
This project is a classic port of the "fizz buzz" game to the Alexa environment.

## Technologies
Project is created with:
* JavaScript
* Node.js
* Alexa Developer Console

## Setup
* Open Alexa Developer Console and paste index.js into the corresponding file, other files were unchanged.
* Set up the necessary intents shown in models/intents.json.

## Features
* Starts a "fizz buzz" game.
* Provides rules to "fizz buzz".
* Provides a list of commands.
* Navigates to home.
* Repeats the last statement.
* Stops the game.

## Design Choice
* While in a game, any response other than the correct answer would lose the game to reflect the real world, including asking for instruction, similarly, no pause game function is implemented.
* Alexa will respond differently to the same utterances depending on whether in game or not.
* Skill Invocation Name is volley fizz buzz instead of fizz buzz. This is due to a built-in fizz buzz game causing confusion to the test console.
* EndGameIntent was ultimately not implemented since CancelIntent & StopIntent have similar functions.
