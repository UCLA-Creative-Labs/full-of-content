import React, {useEffect, useRef, useState} from 'react';
import {
  Collapse,
  Flex,
  TextInput,
  IconButton
  Checkbox,
} from '@contentful/f36-components';
import { ChevronDownTrimmedIcon, ChevronUpTrimmedIcon, CloseTrimmedIcon } from '@contentful/f36-icons';

export interface IAnswer {
  answer: string,
  projects: string[],
}

interface AnswerProps {
  id: number;
  answer: IAnswer;
  projects: string[];
  deleteAnswer: (id: number) => void;
  editAnswer: (id: number, newAnswer: IAnswer) => void;
}

export function Answer({answer, id, projects, deleteAnswer, editAnswer}: AnswerProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [textInput, setTextInput] = useState<string>(answer.answer);
  const [selectedProjects, setSelectedProjects] = useState<{[project: string]: boolean}>(
    projects.reduce((acc: {[key: string]: boolean}, p) => {
      acc[p] = !!answer.projects.find(proj => proj === p);
      return acc;
    }, {})
  );

  useEffect(() => {
    editAnswer(id, {
      answer: answer.answer,
      projects: Object.entries(selectedProjects).reduce((acc: string[], [project, isSelected]) => {
        if (isSelected) acc.push(project);
        return acc;
      }, []),
    });
  }, [selectedProjects]);

  useEffect(() => {
    if (textInput !== answer.answer)
      editAnswer(id, {answer: textInput, projects: answer.projects});
  }, [textInput]);

  return (
    <div style={{ marginBottom: '16px' }}>
      <Flex gap="spacing2Xs" >
        <TextInput
          type="text"
          name="question"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type your answer here and press enter to submit"
        />
        <IconButton
          variant="secondary"
          aria-label={isExpanded ? 'hide' : 'close'}
          onClick={() => setIsExpanded(prev => !prev)}
          icon={isExpanded ? <ChevronUpTrimmedIcon /> : <ChevronDownTrimmedIcon />}
        />
        <IconButton
          aria-label="close"
          style={{ margin: '0px' }}
          variant="negative"
          onClick={() => deleteAnswer(id)}
          icon={<CloseTrimmedIcon />}
        />
      </Flex>
      <Collapse isExpanded={isExpanded} style={{marginTop: '16px', paddingLeft: '16px'}}>
        {Object.entries(selectedProjects).map(([proj, isSelected]) => {
          return (
            <Checkbox
              key={`id-${proj}`}
              isChecked={isSelected}
              onChange={() => setSelectedProjects(prev => ({
                ...prev, [proj]: !prev[proj]
              }))}
              value={proj}
              id={`id-${proj}`}
            >
              {proj}
            </Checkbox>
          );
        })}
      </Collapse>
    </div>

  );
}
