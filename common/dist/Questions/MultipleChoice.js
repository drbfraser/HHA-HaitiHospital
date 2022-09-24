"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleSelectionQuestion = exports.SingleSelectionQuestion = void 0;
const ObjectSerializer_1 = require("../Serializer/ObjectSerializer");
const Question_1 = require("./Question");
// Choice for multiple choice questions
(0, ObjectSerializer_1.serializable)('');
class Choice {
    constructor(description) {
        this.getDescription = () => {
            return this.description;
        };
        this.choose = () => {
            this.chosen = true;
        };
        this.unchoose = () => {
            this.chosen = false;
        };
        this.wasChosen = () => {
            return this.chosen;
        };
        this.description = description;
    }
}
class MultipleChoiceQuestion extends Question_1.Question {
    constructor(id, prompt, defaultAnswer) {
        super(id, prompt, defaultAnswer);
        this.addChoice = (choiceDescription) => {
            this.choices.push(new Choice(choiceDescription));
        };
        // Return the choice descriptions in their respective order.
        this.getChoices = () => {
            return this.choices.map((choice) => choice.getDescription());
        };
        this.choices = new Array();
    }
}
// Multiple choice questions in which the user is only allowed to select one
// choice
let SingleSelectionQuestion = class SingleSelectionQuestion extends MultipleChoiceQuestion {
    constructor() {
        super(...arguments);
        // Won't do anything if answer index is greater than the number of choices
        this.setAnswer = (answer) => {
            var _a, _b;
            if (answer < 0 || answer >= this.choices.length) {
                return;
            }
            (_a = this.choices[this.getAnswer()]) === null || _a === void 0 ? void 0 : _a.unchoose();
            (_b = this.choices[answer]) === null || _b === void 0 ? void 0 : _b.choose();
            super.setAnswer(answer);
        };
    }
};
SingleSelectionQuestion = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined, '')
], SingleSelectionQuestion);
exports.SingleSelectionQuestion = SingleSelectionQuestion;
// Multiple choice questions in which the user is allowed to select multiple
// choices.
let MultipleSelectionQuestion = class MultipleSelectionQuestion extends MultipleChoiceQuestion {
    constructor() {
        super(...arguments);
        // Will ignore indexes whose value are greater than the number of choices
        this.setAnswer = (answer) => {
            var _a;
            (_a = this.getAnswer()) === null || _a === void 0 ? void 0 : _a.forEach((index) => this.choices[index].unchoose());
            let filteredAnswer = answer.filter((index) => index >= 0 && index < this.choices.length);
            filteredAnswer.forEach((index) => this.choices[index].choose());
            super.setAnswer(filteredAnswer);
        };
    }
};
MultipleSelectionQuestion = __decorate([
    (0, ObjectSerializer_1.serializable)(undefined, '')
], MultipleSelectionQuestion);
exports.MultipleSelectionQuestion = MultipleSelectionQuestion;
