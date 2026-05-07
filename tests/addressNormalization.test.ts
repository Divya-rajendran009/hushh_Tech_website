import { describe, expect, it } from 'vitest';

import {
  buildOnboardingAddressRepairPatch,
  normalizeDetectedAddress,
} from '../src/services/location/addressNormalization.js';
import type { LocationData } from '../src/services/location/types';

const mahalungeAddress = {
  country: 'India',
  countryCode: 'IN',
  state: 'Maharashtra',
  stateCode: 'MH',
  city: 'Pune',
  postalCode: '411045',
  phoneDialCode: '+91',
  timezone: 'Asia/Kolkata',
  formattedAddress: '1, Tower-3, Godrej Hillside, Mahalunge, Pune, Maharashtra 411045, India',
  latitude: 18.5943,
  longitude: 73.7537,
} satisfies LocationData;

const seattleAddress = {
  country: 'United States',
  countryCode: 'US',
  state: 'Washington',
  stateCode: 'WA',
  city: 'Seattle',
  postalCode: '98109',
  phoneDialCode: '+1',
  timezone: 'America/Los_Angeles',
  formattedAddress: '500 Terry Ave N, Seattle, Washington 98109, United States',
  latitude: 47.6221,
  longitude: -122.3378,
} satisfies LocationData;

const londonAddress = {
  country: 'United Kingdom',
  countryCode: 'GB',
  state: 'Greater London',
  stateCode: '',
  city: 'London',
  postalCode: 'SW1A 2AA',
  phoneDialCode: '+44',
  timezone: 'Europe/London',
  formattedAddress: '10 Downing Street, Westminster, London SW1A 2AA, United Kingdom',
  latitude: 51.5034,
  longitude: -0.1276,
} satisfies LocationData;

describe('address normalization', () => {
  it('keeps the full street/building/locality prefix in address line 1', () => {
    const normalized = normalizeDetectedAddress(mahalungeAddress, 'India');

    expect(normalized.addressLine1).toBe('1, Tower-3, Godrej Hillside, Mahalunge');
    expect(normalized.addressLine2).toBe('Pune, Maharashtra');
    expect(normalized.city).toBe('Pune');
    expect(normalized.state).toBe('Maharashtra');
    expect(normalized.zipCode).toBe('411045');
    expect(normalized.country).toBe('India');
  });

  it('builds address line 2 from live GPS locality fields instead of a fixed literal', () => {
    const normalized = normalizeDetectedAddress(seattleAddress, 'United States');

    expect(normalized.addressLine1).toBe('500 Terry Ave N');
    expect(normalized.addressLine2).toBe('Seattle, Washington');
    expect(normalized.city).toBe('Seattle');
    expect(normalized.state).toBe('Washington');
    expect(normalized.zipCode).toBe('98109');
  });

  it('keeps UK city and postcode segments out of address line 1', () => {
    const normalized = normalizeDetectedAddress(londonAddress, 'United Kingdom');

    expect(normalized.addressLine1).toBe('10 Downing Street, Westminster');
    expect(normalized.addressLine2).toBe('London, Greater London');
    expect(normalized.city).toBe('London');
    expect(normalized.state).toBe('Greater London');
    expect(normalized.zipCode).toBe('SW1A 2AA');
  });

  it('accepts US state abbreviations while returning the full GPS state name', () => {
    const normalized = normalizeDetectedAddress({
      country: 'United States',
      countryCode: 'US',
      state: 'California',
      stateCode: 'CA',
      city: 'San Francisco',
      postalCode: '94105',
      phoneDialCode: '+1',
      timezone: 'America/Los_Angeles',
      formattedAddress: '1 Market St, San Francisco, CA 94105, United States',
      latitude: 37.7936,
      longitude: -122.3958,
    }, 'United States');

    expect(normalized.addressLine1).toBe('1 Market St');
    expect(normalized.addressLine2).toBe('San Francisco, California');
    expect(normalized.city).toBe('San Francisco');
    expect(normalized.state).toBe('California');
    expect(normalized.zipCode).toBe('94105');
  });

  it('does not infer a state abbreviation as the city when GPS locality data is incomplete', () => {
    const normalized = normalizeDetectedAddress({
      country: 'United States',
      countryCode: 'US',
      state: '',
      stateCode: '',
      city: '',
      postalCode: '12345',
      phoneDialCode: '+1',
      timezone: 'America/New_York',
      formattedAddress: '123 Main St, Anytown, ST 12345, United States',
      latitude: 40.7128,
      longitude: -74.006,
    }, 'United States');

    expect(normalized.addressLine1).toBe('123 Main St');
    expect(normalized.addressLine2).toBe('Anytown, ST');
    expect(normalized.city).toBe('Anytown');
    expect(normalized.state).toBe('ST');
    expect(normalized.zipCode).toBe('12345');
  });

  it('removes repeated trailing city segments without dropping street locality', () => {
    const normalized = normalizeDetectedAddress({
      ...seattleAddress,
      formattedAddress: '500 Terry Ave N, Seattle, Seattle, Washington 98109, United States',
    }, 'United States');

    expect(normalized.addressLine1).toBe('500 Terry Ave N');
    expect(normalized.addressLine2).toBe('Seattle, Washington');
  });

  it('falls back to the formatted GPS address when the structured city is missing', () => {
    const normalized = normalizeDetectedAddress({
      ...mahalungeAddress,
      city: '',
    }, 'India');

    expect(normalized.addressLine1).toBe('1, Tower-3, Godrej Hillside, Mahalunge');
    expect(normalized.addressLine2).toBe('Pune, Maharashtra');
    expect(normalized.city).toBe('Pune');
    expect(normalized.state).toBe('Maharashtra');
  });

  it('falls back to the formatted GPS address when the structured state is missing', () => {
    const normalized = normalizeDetectedAddress({
      ...mahalungeAddress,
      state: '',
      stateCode: '',
    }, 'India');

    expect(normalized.addressLine1).toBe('1, Tower-3, Godrej Hillside, Mahalunge');
    expect(normalized.addressLine2).toBe('Pune, Maharashtra');
    expect(normalized.city).toBe('Pune');
    expect(normalized.state).toBe('Maharashtra');
  });

  it('builds a repair patch for truncated line 1 and auto-filled city/state line 2', () => {
    const patch = buildOnboardingAddressRepairPatch({
      address_line_1: '1',
      address_line_2: '',
      city: null,
      state: null,
      zip_code: null,
      address_country: null,
      gps_full_address: mahalungeAddress.formattedAddress,
      gps_city: 'Pune',
      gps_state: 'Maharashtra',
      gps_country: 'India',
      gps_zip_code: '411045',
    });

    expect(patch).toEqual({
      address_line_1: '1, Tower-3, Godrej Hillside, Mahalunge',
      address_line_2: 'Pune, Maharashtra',
      city: 'Pune',
      state: 'Maharashtra',
      zip_code: '411045',
      address_country: 'India',
    });
  });

  it('does not build a repair patch when GPS columns have no usable address evidence', () => {
    expect(buildOnboardingAddressRepairPatch({
      address_line_1: 'Saved manual address',
      address_line_2: 'Suite 2',
      city: 'Seattle',
      state: 'Washington',
      zip_code: '98109',
      address_country: 'United States',
      gps_full_address: '',
      gps_city: '',
      gps_state: '',
      gps_country: '',
      gps_zip_code: '',
    })).toBeNull();
  });
});
