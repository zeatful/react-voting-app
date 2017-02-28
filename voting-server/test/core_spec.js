import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

const TRAIN_SPOTTING = 'Trainspotting';
const TWENTY_EIGHT_DAYS_LATER = '28 Days Later';
const SUNSHINE = 'Sunshine';

describe('application logic', () => {
   describe('setEntries', () => {
     it('converts to immutable', () => {
        const state = Map();
        const entries = [TRAIN_SPOTTING, TWENTY_EIGHT_DAYS_LATER];
        const nextState = setEntries(state, entries);
        expect(nextState).to.equal(Map({
            entries: List.of(TRAIN_SPOTTING, TWENTY_EIGHT_DAYS_LATER)
        }));
     });
   });

   describe('next', () => {
      it('takes the next two entries under vote', () => {
         const state = Map({
             entries: List.of(TRAIN_SPOTTING, TWENTY_EIGHT_DAYS_LATER, SUNSHINE)
         });
         const nextState = next(state);
         expect(nextState).to.equal(Map({
             vote: Map({
                 pair: List.of(TRAIN_SPOTTING, TWENTY_EIGHT_DAYS_LATER)
             }),
             entries: List.of(SUNSHINE)
         }));
      });

       it('puts winner of current vote back to entries', () => {
           const state = Map({
               vote: Map({
                   pair: List.of('Trainspotting', '28 Days Later'),
                   tally: Map({
                       'Trainspotting': 4,
                       '28 Days Later': 2
                   })
               }),
               entries: List.of('Sunshine', 'Millions', '127 Hours')
           });
           const nextState = next(state);
           expect(nextState).to.equal(Map({
               vote: Map({
                   pair: List.of('Sunshine', 'Millions')
               }),
               entries: List.of('127 Hours', 'Trainspotting')
           }));
       });

       it('puts both from tied vote back to entries', () => {
           const state = Map({
               vote: Map({
                   pair: List.of('Trainspotting', '28 Days Later'),
                   tally: Map({
                       'Trainspotting': 3,
                       '28 Days Later': 3
                   })
               }),
               entries: List.of('Sunshine', 'Millions', '127 Hours')
           });
           const nextState = next(state);
           expect(nextState).to.equal(Map({
               vote: Map({
                   pair: List.of('Sunshine', 'Millions')
               }),
               entries: List.of('127 Hours', 'Trainspotting', '28 Days Later')
           }));
       });

       it('marks winner when just one entry left', () => {
           const state = Map({
               vote: Map({
                   pair: List.of('Trainspotting', '28 Days Later'),
                   tally: Map({
                       'Trainspotting': 4,
                       '28 Days Later': 2
                   })
               }),
               entries: List()
           });
           const nextState = next(state);
           expect(nextState).to.equal(Map({
               winner: 'Trainspotting'
           }));
       });
   });

   describe('vote', () => {
       it('creates a tally for the voted entry', () => {
           const state = Map({
               pair: List.of('Trainspotting', '28 Days Later')
           });
           const nextState = vote(state, 'Trainspotting')
           expect(nextState).to.equal(Map({
               pair: List.of('Trainspotting', '28 Days Later'),
               tally: Map({
                   'Trainspotting': 1
               })
           }));
       });

       it('adds to existing tally for the voted entry', () => {
           const state = Map({
               pair: List.of('Trainspotting', '28 Days Later'),
               tally: Map({
                   'Trainspotting': 3,
                   '28 Days Later': 2
               })
           });
           const nextState = vote(state, 'Trainspotting');
           expect(nextState).to.equal(Map({
               pair: List.of('Trainspotting', '28 Days Later'),
               tally: Map({
                   'Trainspotting': 4,
                   '28 Days Later': 2
               })
           }));
       });
   });
});