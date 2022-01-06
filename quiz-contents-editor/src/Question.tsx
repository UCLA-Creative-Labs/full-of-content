import React, {useEffect, useRef, useState} from 'react';
import {
  Flex,
  Accordion,
  Button,
  TextInput,
  Subheading,
  IconButton,
  FormControl,
} from '@contentful/f36-components';
import { PlusTrimmedIcon } from '@contentful/f36-icons';
import { Answer, IAnswer } from './Answer';

export const QUESTION_DEFAULT = 'What makes a frog a frog?';

export interface IQuestion {
  question: string;
  answers: {[key: string]: IAnswer};
}

interface QuestionProps {
  id: number;
  question: IQuestion;
  projects: string[];
  deleteQuestion: (id: number) => void;
  editQuestion: (id: number, newQuestion: IQuestion) => void;
}

export function Question({id, question, deleteQuestion, editQuestion, projects}: QuestionProps): JSX.Element {
  const [textInput, setTextInput] = useState(question.question);
  const [answers, setAnswers] = useState<{[key: string]: IAnswer}>(question.answers);

  const keyRef = useRef(Object.keys(question.answers).reduce((acc, prev) => Math.max(acc, +prev), 0) + 1);

  const addAnswer = () => {
    const key = keyRef.current;
    console.log(key);
    console.log(answers);
    setAnswers(prev => ({
      ...prev,
      [key]: {
        answer: '',
        projects: [],
      },
    }));
    keyRef.current++;
  }

  const deleteAnswer = (id: number) => {
    setAnswers(prev => {
      const { [id]: _question, ...rest } = prev;
      return rest;
    });
  }

  const editAnswer = (id: number, newAnswer: IAnswer) => {
    setAnswers(prev => {
      return {...prev, [id]: newAnswer };
    });
  }

  useEffect(() => {
    editQuestion(id, {question: question.question, answers});
  }, [answers]);

  useEffect(() => {
    if (textInput !== question.question) 
      editQuestion(id, {question: textInput, answers});
  }, [textInput]);

  return (
    <Accordion.Item title={question.question} >
      <div style={{margin: "16px"}}>
        <FormControl>
          <FormControl.Label>Question</FormControl.Label>
          <TextInput
            type="text"
            name="cf-question"
            value={textInput}
            placeholder={QUESTION_DEFAULT}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <FormControl.HelpText>Type your question here and press enter to submit!</FormControl.HelpText>
        </FormControl>
        <Subheading>Answers</Subheading>
        {Object.entries(answers).map(([idx, answer]) => {
          return (<Answer key={idx} id={+idx} answer={answer} projects={projects} deleteAnswer={deleteAnswer} editAnswer={editAnswer}/>);
        })}
        <Flex style={{marginTop: '16px'}} gap={'spacingS'}>
          <Button variant="primary" onClick={() => addAnswer()}>Add answer</Button>
          <Button variant="negative" onClick={() => deleteQuestion(id)}>Delete Question</Button>
        </Flex>
      </div>
    </Accordion.Item>

  )
}
