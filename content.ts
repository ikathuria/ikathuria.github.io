/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const IMPACT_STATS: Array<{
    displayValue: string | null;
    numericEnd: number | null;
    prefix: string;
    suffix: string;
    label: string;
}> = [
    { displayValue: '2.5hr→30m', numericEnd: null, prefix: '', suffix: '', label: 'debugging time cut at AWS' },
    { displayValue: null, numericEnd: 50, prefix: '$', suffix: 'K/mo', label: 'infrastructure costs saved' },
    { displayValue: null, numericEnd: 172, prefix: '', suffix: 'K+', label: 'lines of code shipped' },
    { displayValue: null, numericEnd: 200, prefix: '', suffix: '+', label: 'students mentored into AI' },
    { displayValue: null, numericEnd: 4, prefix: '', suffix: '', label: 'peer-reviewed papers' },
    { displayValue: null, numericEnd: 9, prefix: '', suffix: '', label: 'hackathons built & led' },
    { displayValue: '4.0 GPA', numericEnd: null, prefix: '', suffix: '', label: 'at Purdue University' },
];
