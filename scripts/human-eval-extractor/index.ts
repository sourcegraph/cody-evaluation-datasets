import path from 'path';
import Data from './HumanEval-RandomSpanInfillingLight.json';

import { mkdirSync, writeFileSync } from 'fs';

interface Config {
    entryFile: string;
    solutionFile: string;
    testFile: string;
    testCommand: string;
}

const REPO_ROOT = path.resolve('../..')

for (let i = 0; i < Data.length; i++) {
    const benchmarkCase = Data[i]

    const entryText = `${benchmarkCase.prompt}█${benchmarkCase.suffix}`
    const solutionText = `${benchmarkCase.prompt}${benchmarkCase.canonical_solution}${benchmarkCase.suffix}`
    const isMultiLine = solutionText.split('\n').length - entryText.split('\n').length > 1

    if (!isMultiLine) {
        // Single line, do nothing
        continue
    }

    // Multi line, lets go
    const newDir = path.resolve(REPO_ROOT, 'human-eval-infill-multi-line', i.toString())
    mkdirSync(newDir)

    // Create entry file
    const entryFilePath = path.join(newDir, 'generated.py')
    writeFileSync(entryFilePath, entryText, 'utf8')

    // Create solution file
    const solutionFilePath = path.join(newDir, 'solution.py')
    writeFileSync(solutionFilePath, solutionText, 'utf8')

    // Create runnable test file
    const testFilePath = path.join(newDir, 'test.py')
    const testPrefix = `from generated import ${benchmarkCase.entry_point}\nimport sys`
    const testSuffix = `
try:
    check(${benchmarkCase.entry_point})
except AssertionError:
    sys.exit(1)
sys.exit(0)
`
    writeFileSync(testFilePath, testPrefix + benchmarkCase.test + testSuffix, 'utf8')

    // Create final config file
    const configFilePath = path.join(newDir, 'config.json')
    const config: Config = {
        entryFile: 'generated.py',
        solutionFile: 'solution.py',
        testFile: 'test.py',
        testCommand: `python3 test.py`
    }
    writeFileSync(configFilePath, JSON.stringify(config, null, 2), 'utf8')
}
