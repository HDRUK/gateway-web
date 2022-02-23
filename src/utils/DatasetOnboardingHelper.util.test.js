import DatasetOnboardingHelper from './DatasetOnboardingHelper.util';
const updatesSubmitted = {
	'provenance/temporal/distributionReleaseDate': {
		previousAnswer: '',
		updatedAnswer: '02/11/2021',
	},
};
const locations = ['United Kingdon,Cambridge', 'United States'];

describe('DatasetOnboardingHelper getUpdatesSubmittedLog', () => {
	it('should return object with `heading` `question` `answers` properties', () => {
		let log = DatasetOnboardingHelper.getUpdatesSubmittedLog(updatesSubmitted);
		expect(log.heading).toEqual('Provenance | Temporal');
		expect(log.question).toEqual('Distribution Release Date');
		expect(log.answers).toEqual({ previousAnswer: '', updatedAnswer: '02/11/2021' });
	});

	it('should return object with `heading` `question` `answers` properties', () => {
		let log = DatasetOnboardingHelper.getUpdatesSubmittedLog({
			'summary/temporal': {
				previousAnswer: '',
				updatedAnswer: 'updated answer',
			},
		});
		expect(log.heading).toEqual('Summary');
		expect(log.question).toEqual('Temporal');
		expect(log.answers).toEqual({ previousAnswer: '', updatedAnswer: 'updated answer' });
	});
});

describe('DatasetOnboardingHelper getLocationsObj', () => {
	it('should return an array of object with `location` `hierarchy`', () => {
		let values = DatasetOnboardingHelper.getLocationsObj(locations);
		expect(values[0].location).toEqual('Cambridge');
		expect(values[0].hierarchy).toEqual('United Kingdon,Cambridge');
		expect(values[1].hierarchy).toEqual('United States');
		expect(values[1].hierarchy).toEqual('United States');
	});
});
