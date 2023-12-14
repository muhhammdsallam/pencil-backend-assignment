

const getAllQuestions = async (req, res) => {
    try {
        // const questions = await Question.find();
        res.json({"message": "questions will be returned here"});
    }
    catch (error) {
        console.log(error);
    }
}

module.exports = getAllQuestions;