import React, { useState } from 'react';
import { styled } from '@linaria/react';
import { isNil } from '@core/utils';
import { $isInProgress, $accounts } from '@state/shared';
import { useStore } from 'effector-react';
import { IconReceive, IconReceived, IconSent } from '@app/icons';

interface CellConfig {
  name: string;
  title: string;
  fn?: (value: any, source: any) => string;
}

interface TableProps {
  keyBy: string;
  data: any[];
  config: CellConfig[];
}

const StyledTable = styled.table`
  width: 600px;
`;

const StyledThead = styled.thead`
  height: 40px;
  border-radius: 10px;
  background-color: rgba(15, 77, 130, .6);
`;

const isPositive = (value: number) => 1 / value > 0;

const Header = styled.th<{ active: boolean }>`
  text-align: left;
  color: ${({ active }) => {
    if (isNil(active)) {
      return '#8da1ad';
    }
    return active ? '#ffffff' : '#8da1ad';
  }};
  padding: 15px 30px;
`;

const Column = styled.td`
  padding: 20px 30px;
  background-color: rgba(13, 77, 118, .9);
`;

const StyledStatus = styled.div`
  display: flex;
  align-items: center;
`;

const StatusText = styled.span<{ isIncome: boolean }>`
  margin-left: 10px;
  color: ${({ isIncome }) => isIncome ? `var(--color-blue` : `var(--color-purple)`};
`;

const Table: React.FC<TableProps> = ({ keyBy, data, config }) => {
  const [filterBy, setFilterBy] = useState(0);
  const [receiveClickedId, setActiveReceive] = useState(null);
  const isInProgress = useStore($isInProgress);
  const account = useStore($accounts);

  const sortFn = (objectA, objectB) => {
    const name = config[Math.abs(filterBy)].name;
    const a = objectA[name];
    const b = objectB[name];

    if (a === b) {
      return 0;
    }

    const sign = isPositive(filterBy) ? 1 : -1;
    return a > b ? sign : -sign;
  };

  const handleSortClick: React.MouseEventHandler<HTMLElement> = event => {
    const index = parseInt(event.currentTarget.dataset.index);
    setFilterBy(index === filterBy ? -filterBy : index);
  };

  const handleReceiveClick = () => {
   
  };

  return !isNil(data) && data.length > 0 ? (
    <StyledTable>
      <StyledThead>
        <tr>
          {config.map(({ title }, index) => (
            <Header
              key={index}
              data-index={index}
              active={
                index !== Math.abs(filterBy) ? null : isPositive(filterBy)
              }
              onClick={handleSortClick}>
                {title}
            </Header>
          ))}
        </tr>
      </StyledThead>
      <tbody>
        {data.sort(sortFn).map((item, index) => (
          <tr key={index}>
            {config.map(({ name, fn }, itemIndex) => {
              const value = item[name];
              const isIncome = item.to === account[0];
              return name === 'status' 
                ? (
                <Column key={itemIndex}>
                  <StyledStatus>
                    {isIncome ? <IconReceived/> : <IconSent/>}
                    <StatusText isIncome={isIncome}>{isIncome ? 'received' : 'sent'}</StatusText>
                  </StyledStatus>
                </Column>) 
                : (<Column key={itemIndex}>{isNil(fn) ? value : fn(value, item)}</Column>);
            })}
          </tr>
        ))}
      </tbody>
    </StyledTable>
  ) : (<></>);
};

export default Table;
