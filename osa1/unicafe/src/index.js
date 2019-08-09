import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Statistics = ({ good, neutral, bad }) => {
    if (good !== 0 || neutral !== 0 || bad !== 0) {
        return <div>
            <h1>statistics</h1>
            <table>
                <tbody>
                    <Statistic text="good" value={good} />
                    <Statistic text="neutral" value={neutral} />
                    <Statistic text="bad" value={bad} />
                    <Statistic text="all" value={good + neutral + bad} />
                    <Statistic text="average" value={1.0 * (good - bad) / (good + neutral + bad)} />
                    <Statistic text="positive" value={100.0 * good / (good + neutral + bad)} />
                </tbody>
            </table>
        </div>
    }
    return <div><br />No feedback given</div>
}

const Statistic = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

const Button = ({ clickHanddler, text }) =>
    <button onClick={clickHanddler}>{text}</button>

const App = () => {
    // tallenna napit omaan tilaansa
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <div>
            <div>
                <h1>give feedback</h1>
                <Button clickHanddler={() => setGood(good + 1)} text="good" />
                <Button clickHanddler={() => setNeutral(neutral + 1)} text="neutral" />
                <Button clickHanddler={() => setBad(bad + 1)} text="bad" />
            </div>
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)
