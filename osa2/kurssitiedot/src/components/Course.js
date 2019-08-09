import React from 'react'

const Course = ({ course }) => (
    <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
)

const Header = (props) => (
    <h2>{props.course}</h2>
)

const Content = (props) => (
    <div>
        {
            props.parts.map(p => (
                <Part key={p.id} part={p} />
            ))
        }
    </div>
)

const Part = (props) => (
    <p>
        {props.part.name} {props.part.exercises}
    </p>
)

const Total = (props) => (
    <h4>total of {props.parts.map(p => p.exercises).reduce((a, b) => a + b, 0)} exercises</h4>
)

export default Course
