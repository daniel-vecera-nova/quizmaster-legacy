import type { Page, TestInfo } from '@playwright/test'

import {
    WorkspaceCreatePage,
    HomePage,
    QuestionEditPage,
    WorkspacePage,
    QuizCreatePage,
    QuestionPage,
    QuizScorePage,
    QuizWelcomePage,
    QuizStatsPage,
    TakeQuestionPage,
} from 'pages'
import { emptyQuestion, type Question } from './question.ts'
import { emptyQuiz, type Quiz, type QuizBookmark } from './quiz.ts'

export class QuizmasterWorld {
    constructor(
        public page: Page,
        public testInfo: TestInfo,
    ) {
        this.questionEditPage = new QuestionEditPage(this.page)
        this.workspaceCreatePage = new WorkspaceCreatePage(this.page)
        this.takeQuestionPage = new TakeQuestionPage(this.page)
        this.questionPage = new QuestionPage(this.page)
        this.quizWelcomePage = new QuizWelcomePage(this.page)
        this.quizStatsPage = new QuizStatsPage(this.page)
        this.quizScorePage = new QuizScorePage(this.page)
        this.workspacePage = new WorkspacePage(this.page)
        this.quizCreatePage = new QuizCreatePage(this.page)
        this.homePage = new HomePage(this.page)
    }

    readonly questionEditPage: QuestionEditPage
    readonly workspaceCreatePage: WorkspaceCreatePage
    readonly takeQuestionPage: TakeQuestionPage
    readonly questionPage: QuestionPage
    readonly quizWelcomePage: QuizWelcomePage
    readonly quizStatsPage: QuizStatsPage
    readonly quizScorePage: QuizScorePage
    readonly workspacePage: WorkspacePage
    readonly quizCreatePage: QuizCreatePage
    readonly homePage: HomePage

    quizId = ''

    questionWip: Question = emptyQuestion()
    quizWip: Quiz = emptyQuiz()
    nextAnswerIdx = 0
    questionBookmarks: Record<string, Question> = {}
    activeQuestionBookmark = ''
    get activeQuestion() {
        return this.questionBookmarks[this.activeQuestionBookmark]
    }

    quizBookmarks: Record<string, QuizBookmark> = {}
    activeQuizBookmark = ''
    correctAnswersCounts: Record<string, string> = {}

    parseAnswers(answersString: string) {
        return answersString.split(',').map(answer => answer.trim())
    }
}
