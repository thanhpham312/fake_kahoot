/**
 * Request to get API url
 * @type {request}
 */
const request = require('request')
/**
 * Lodash helper functions
 * @type {function(*): Object}
 * @private
 */
const _ = require('lodash')

/**
 * getQuestions fetches question from the Open Trivia Database and returns the results in a formatted object.
 * @param numberofQuestions Number of questions to be generated.
 * @param category Category of questions.
 * @param difficulty Questions diffuculty. Could either be 'easy', 'medium', or 'hard'.
 * @param questionType Type of questions. Could either be 'multiple' or 'booleon'.
 * @returns {Promise<object>} A object with information about questions fetched from the API.
 * @throws Failed Connect - Could not connect to opentdb.
 * @throws Invalid query.
 */
let getQuestions = (numberofQuestions = 10, category = 11, difficulty = 'medium', questionType = 'multiple') => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://opentdb.com/api.php?amount=${encodeURIComponent(numberofQuestions)}&category=${encodeURIComponent(category)}&difficulty=${encodeURIComponent(difficulty)}&type=${encodeURIComponent(questionType)}`,
      json: true
    }, (error, response, body) => {
      if (error) {
        reject(new Error('Cannot connect to Open Trivia Database.'))
      } else if (body.response_code === 400) {
        reject(new Error('Invalid query.'))
      } else {
        let questionList = []
        for (let i = 0; i < body.results.length; i++) {
          let answerArray = body.results[i].incorrect_answers.slice()
          answerArray.push(body.results[i].correct_answer)
          answerArray = _.shuffle(answerArray)
          questionList.push({
            'question': body.results[i].question,
            'option1': answerArray[0],
            'option2': answerArray[1],
            'option3': answerArray[2],
            'option4': answerArray[3],
            'answers': _.indexOf(answerArray, body.results[i].correct_answer) + 1
          })
        }
        resolve(questionList)
      }
    })
  })
}

/**
 * Export the promise
 * @type {{getQuestions: function(*=, *=, *=, *=): Promise<any>}}
 */
module.exports = {
  getQuestions
}
