import React, { useState } from 'react';
import { styled } from '@linaria/react';
//import { Transaction } from '@app/core/types';
import { useEffect } from 'react';
import { IconDeposit, IconConfirm } from '@app/shared/icons';
import { useSelector } from 'react-redux';
import { selectSystemState } from '../store/selectors';

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
  width: 630px;
`;

const StyledThead = styled.thead`
  height: 40px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.08);
`;

const isPositive = (value: number) => 1 / value > 0;

const Header = styled.th<{ active: boolean }>`
  background-color: rgba(13, 77, 118, .9);
  text-align: left;
  color: ${({ active }) => {
    if (!active) {
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

const ConfirmReceive = styled.div<{disabled: boolean}>`
  width: 167px;
  height: 32px;
  padding: 8px 16px;
  border-radius: 17.5px;
  border: solid 1px #0bccf7;
  background-color: rgba(11, 204, 247, 0.1);
  color: #0bccf7;
  text-align: center;
  font-size: 14px;
  cursor: ${({ disabled }) => disabled ? "not-allowed" : "pointer"};
  opacity: ${({ disabled }) => disabled ? "0.5" : ""};
  display: flex;
  flex-direction: row;

  &:hover,
  &:active {
    box-shadow: ${({ disabled }) => disabled ? "none" : "0 0 8px white"};
  }

  > .text {
    margin: 0 auto;
    display: flex;
    align-items: center;

    svg {
      margin-right: 10px;
    }
  }
`;

const Completed = styled.div`
  display: flex;

  > .icon-deposit {
    margin-left: 2px;
    margin-right: 12px;
  }

  > .icon-receive {
    margin-right: 10px;
  }

  > .text-receive {
    color: #0BCCF7;
  }

  > .text-deposit {
    color: #DA68F5;
  }
`;

const Table: React.FC<TableProps> = ({ keyBy, data, config }) => {
  const [filterBy, setFilterBy] = useState(0);
  const [receiveClickedId, setActiveReceive] = useState(null);
  const isInProgress =  false //useStore($isInProgress);
  const [trs, setTrs] = useState(data);
  const appParams = useSelector(selectSystemState())

  useEffect(() => {
    setTrs(data);
    // .sort(sortFn)
    //trs = data.length > 0 ? data : [];
  },[data]);

  console.log('TABLE:', data);

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

  return  (
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
        {trs && trs.length > 0 ? trs.map((item, index) => (
          <tr key={index}>
            {config.map(({ name, fn }, itemIndex) => {
              const value = item[name];
              return name === 'status' 
                ? (
                <Column key={itemIndex}>
                  <Completed>
                    {appParams.account === item.to ? 
                      <IconConfirm className='icon-receive'/> : 
                      <IconDeposit className='icon-deposit'/>} 
                      {<span className={appParams.account === item.to ? 'text-receive' : 'text-deposit'}>
                        completed
                      </span>}
                  </Completed>
                </Column>) 
                : (<Column key={itemIndex}>{!fn ? value : fn(value, item)}</Column>);
            })}
          </tr>
        )): (<></>)
      }
      </tbody>
    </StyledTable>
  ) ;
};

export default Table;
