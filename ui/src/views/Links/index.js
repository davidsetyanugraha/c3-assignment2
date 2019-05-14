// Title: The Seven Deadly Sins in Social Media Case Study in Victoria Cities
// Team Name: Team 14
// Team Members:
//   Dading Zainal Gusti (1001261)
//   David Setyanugraha (867585)
//   Ghawady Ehmaid (983899)
//   Indah Permatasari (929578)
//   Try Ajitiono (990633)

import React from 'react';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

const tableRows = [
  {
    url: '/htmls/correlation.html',
    title: 'Correlation',
    description: 'Correlation between AURIN and our analytics result'
  },
  {
    url: '/htmls/envy.html',
    title: 'Envy',
    description: 'The envy sin analysis'
  },
  {
    url: '/htmls/gluttony.html',
    title: 'Gluttony',
    description: 'The gluttony sin analysis'
  },
  {
    url: '/htmls/greed.html',
    title: 'Greed',
    description: 'The greed sin analysis'
  },
  {
    url: '/htmls/lust.html',
    title: 'Lust',
    description: 'The lust sin analysis'
  },
  {
    url: '/htmls/pride.html',
    title: 'Pride',
    description: 'The pride sin analysis'
  },
  {
    url: '/htmls/sins_by_timerange.html',
    title: 'Sins by Timerange',
    description: 'The timerange sin analysis'
  },
  {
    url: '/htmls/sloth.html',
    title: 'Sloth',
    description: 'The sloth sin analysis'
  },
  {
    url: '/htmls/travel_dest.html',
    title: 'Travel Destination',
    description: 'Most common travel destinations'
  },
  {
    url: '/htmls/unliveable.html',
    title: 'Unliveable',
    description: 'Most unliveable cities to live on'
  },
  {
    url: '/htmls/wrath.html',
    title: 'Wrath',
    description: 'The wrath sin analysis'
  }
];

export default function Links() {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>URL Title</TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tableRows.map(({ url, title, description }) => (
          <TableRow>
            <TableCell>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {title}
              </a>
            </TableCell>
            <TableCell>{description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
