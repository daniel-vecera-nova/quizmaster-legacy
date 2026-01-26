import fs from 'node:fs'
import { AstBuilder, GherkinClassicTokenMatcher, Parser } from '@cucumber/gherkin'
import { type GherkinDocument, IdGenerator } from '@cucumber/messages'
import { indexHtml, toHtml, type HtmlFile } from './html.tsx'

const createParser = () => {
    const uuidFn = IdGenerator.uuid()
    const builder = new AstBuilder(uuidFn)
    const matcher = new GherkinClassicTokenMatcher()

    return new Parser(builder, matcher)
}

const parseFeature = (featurePath: string): GherkinDocument => {
    const parser = createParser()
    const gherkinContent = fs.readFileSync(featurePath, 'utf8')

    return parser.parse(gherkinContent)
}

const featureFiles = fs.readdirSync('features').filter(file => file.endsWith('.feature'))

const htmlFiles: HtmlFile[] = featureFiles.map(featureFile => ({
    name: featureFile.replace('.feature', '.html'),
    html: toHtml(parseFeature(`features/${featureFile}`)),
}))

for (const htmlFile of htmlFiles) {
    fs.writeFileSync(`../site/docs/${htmlFile.name}`, htmlFile.html)
}

const index = indexHtml(htmlFiles)
fs.writeFileSync('../site/docs/index.html', index)
