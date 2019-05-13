Below is the specification required to animate dots/create lines on the map.

```js
{
  users: [
    {
      /**
      * Required variables.
      **/
      // points: Array of { point: Point, time: TimeString }.
      // [type] Point: Array of 2 integers in format of longitude and latitude, respectively. Example: [140, -35].
      // [type] TimeString: string. The time when the tweet is posted.
      points: [
        { point: [140, -35], time: 'Wed Feb 25 00:26:16 +0000 2015' },
        { point: [141, -35], time: 'Wed Feb 25 00:27:16 +0000 2015' },
        { point: [142, -35], time: 'Wed Feb 25 00:28:16 +0000 2015' },
        { point: [143, -35], time: 'Wed Feb 25 00:29:16 +0000 2015' },
        { point: [144, -35], time: 'Wed Feb 25 00:30:16 +0000 2015' }
      ],
      /**
      * Optional variables.
      **/
      // user ID: integer. As of now I'm not sure where it can be used.
      id: 12315128312,
      // color: string. Color of the "dot" or "line". This can be generated randomly at UI, but if we want to force the color given from backend, that's OK as well.
      color: 'rgba(200, 30, 40, 1)'
      // userClass: string. As of now I'm not sure where it can be used, but maybe to "classify" the user based on the sin we intepret them to do most.
      userClass: enum('pride','gluttony','greed','wrath','lust','sloth','envy')
    }
  ]
}
```
