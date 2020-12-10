const Alexa = require('ask-sdk-core');
let counter, inGame, lastStatement;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        inGame = false;
        lastStatement = welcomeMessage;
        return handlerInput.responseBuilder
            .speak(welcomeMessage)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const InstructionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'InstructionIntent'
            && inGame === false;
    },
    handle(handlerInput) {
        lastStatement = instructionMessage;
        return handlerInput.responseBuilder
            .speak(instructionMessage)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const GameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GameIntent'
            && inGame === false;
    },
    handle(handlerInput) {
        inGame = true;
        counter = 2;
        lastStatement = startGameMessage;
        return handlerInput.responseBuilder
            .speak(startGameMessage)
            .reprompt('I go first, One')
            .getResponse();
    }
};

const NumberAnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NumberAnswerIntent'
            && inGame === true;
    },
    handle(handlerInput) {
        let speakOutput = '';
        if (getAnswer(counter) !== handlerInput.requestEnvelope.request.intent.slots.number.value) {
            lastStatement = speakOutput = getBadAnswer(counter);
        }
        else {
            lastStatement = speakOutput = getAnswer(++counter);
        }
        counter++;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const WordAnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'WordAnswerIntent'
            && inGame === true;
    },
    handle(handlerInput) {
        let speakOutput ='';
        if (getAnswer(counter) === handlerInput.requestEnvelope.request.intent.slots.keyword.value.toString()) {
            lastStatement = speakOutput = getAnswer(++counter);
        }
        else {
            lastStatement = speakOutput = getBadAnswer(counter);
        }
        counter++;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent';
    },
    handle(handlerInput) {

        return handlerInput.responseBuilder
            .speak(lastStatement)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        lastStatement = repromptMessage;
        return handlerInput.responseBuilder
            .speak(repromptMessage)
            .reprompt(repromptMessage)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        //inGame = false;
        //counter = 2;
        return handlerInput.responseBuilder
            .speak(exitSkillMessage)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
                || ((Alexa.getIntentName(handlerInput.requestEnvelope) === 'InstructionIntent'
                    || Alexa.getIntentName(handlerInput.requestEnvelope) === 'GameIntent'
                        || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent')
                && inGame === true);
    },
    handle(handlerInput) {
        let speakOutput, repromptOutput;
        if (inGame === true) {
            speakOutput = getBadAnswer(counter);
            repromptOutput = `You can play again or exit, what would you like to do?`;
        } else {
            speakOutput = `Sorry, I don't know about that. You can ask me to start a game or to
            read the instructions, What would you like to do?`;
            repromptOutput = repromptMessage;
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);
        console.log(error);
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* CONSTANTS */
const welcomeMessage = `Welcome to Fizz Buzz. You can ask me to start a game or to
read the instructions, What would you like to do?`;
const repromptMessage = `You can ask me to start a game or to
            read the instructions, What would you like to do?`;
const instructionMessage = `We’ll each take turns counting up from one.
        However, you must replace numbers divisible by 3 with the word “fizz” and you must replace 
        numbers divisible by 5 with the word “buzz”. If a number is divisible by both 3 and 5, 
        you should instead say “fizz buzz”. If you get one wrong, you lose. What would you like to do?`;
const startGameMessage = `Ok, I'll start...One`;
const exitSkillMessage = `Thanks for playing Fizz Buzz. For another great Alexa game, check out Song Quiz!`;

/* HELPER FUNCTIONS */

// Returns the correct answer based on the current counter
function getAnswer(counter) {
    if (counter % 15 === 0) {
        return 'fizz buzz';
    } else if (counter % 3 === 0) {
        return 'fizz';
    } else if (counter % 5 === 0) {
        return 'buzz';
    } else {
        return counter.toString();  
    }
}

// Returns a end game statement and the correct answer when the user responds incorrectly
function getBadAnswer(counter) {
    return `I’m sorry, the correct response was ${getAnswer(counter)},
    you can play again or exit, what would you like to do?`;
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        InstructionIntentHandler,
        GameIntentHandler,
        NumberAnswerIntentHandler,
        WordAnswerIntentHandler,
        RepeatIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
