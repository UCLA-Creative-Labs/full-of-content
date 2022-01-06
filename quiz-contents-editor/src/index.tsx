import React, {useEffect, useRef, useState} from 'react';
import { render } from 'react-dom';
import {
  Accordion,
  DisplayText,
  Paragraph,
  Button,
  Flex,
  TextInput,
  Text,
  Form,
  Pill,
  FormControl,
  Checkbox,
  Subheading
} from '@contentful/f36-components';
import { init, locations, EditorExtensionSDK } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';
import { deleteFirst } from './utils/array';
import { QUESTION_DEFAULT, IQuestion, Question } from './Question';

interface AppProps {
  sdk: EditorExtensionSDK;
}

export function App({sdk}: AppProps): JSX.Element {
  const [projects, setProjects] = useState<string[]>(sdk.entry.fields.projects.getValue() ?? []);
  const [title, setTitle] = useState<string>(sdk.entry.fields.title.getValue() ?? '');
  const [textInput, setTextInput] = useState('');
  const [questions, setQuestions] = useState<{[key: number]: IQuestion}>(sdk.entry.fields.questions.getValue() ?? {});
  const keyRef = useRef<number>(Object.keys(questions).reduce((acc, prev) => Math.max(acc, +prev), 0) + 1);

  const addQuestion = () => {
    const key = keyRef.current;
    setQuestions(prev => ({
      ...prev,
      [key]: {
        question: QUESTION_DEFAULT,
        answers: {},
      },
    }));
    keyRef.current++;
  }

  const deleteQuestion = (id: number) => {
    setQuestions(prev => {
      const { [id]: _question, ...rest } = prev;
      return rest;
    });
  }

  const editQuestion = (id: number, newQuestion: IQuestion) => {
    setQuestions(prev => {
      return {...prev, [id]: newQuestion };
    })
  }

  useEffect(() => {
    sdk.entry.fields.title.setValue(title);
  }, [title]);

  useEffect(() => {
    sdk.entry.fields.projects.setValue(projects);
  }, [projects]);

  useEffect(() => {
    console.log(questions);
    sdk.entry.fields.questions.setValue(questions);
  }, [questions]);

  const onTextSubmit = (event) => {
    if (event.key === 'Enter') {
      setProjects(prev => [...prev, textInput]);
      setTextInput('');
    }
  }

  return (
    <Form className="f36-margin--l">
      <DisplayText>Quiz</DisplayText>
      <Paragraph>
        This form is for creating a new personality quiz.
      </Paragraph>
      <FormControl>
        <FormControl.Label>Quiz Title</FormControl.Label>
        <TextInput
          name="title"
          isRequired
          id="cf-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Projects</FormControl.Label>
        <TextInput
          name="projects"
          id="cf-projects"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          onKeyPress={onTextSubmit}
        />
        <FormControl.HelpText>Type a project name and then press enter!</FormControl.HelpText>
      </FormControl>
      <div id={'projects-container'}>
        {projects.map((project, idx) => {
          return (
            <Pill key={idx} label={project} onClose={() => {setProjects(prev => deleteFirst(prev, project))}}/>
          );
        })}
      </div>
      
      <Button onClick={() => addQuestion()}>Add question</Button>
      <Accordion style={{marginTop: '16px'}}>
        {Object.entries(questions).map(([idx, question]) => {
          return (<Question key={idx} deleteQuestion={deleteQuestion} editQuestion={editQuestion} id={+idx} question={question} projects={projects}/>);
        })}
      </Accordion>
    </Form>
  );
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    render(<App sdk={sdk as EditorExtensionSDK} />, document.getElementById('root'));
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
