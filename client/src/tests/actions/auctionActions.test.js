import { describe, test, expect, jest } from 'jest';
import { useQuery } from '@apollo/client';
import { useGetAuctions } from './actions';
import { GET_AUCTIONS } from './graphql/queries';

jest.mock('@apollo/client');

describe('Auction Actions', () => {
  test('useGetAuctions should call useQuery with GET_AUCTIONS', () => {
    useGetAuctions();
    expect(useQuery).toHaveBeenCalledWith(GET_AUCTIONS);
  });
});