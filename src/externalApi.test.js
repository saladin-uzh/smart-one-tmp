/**
 * Created by bryan on 11/26/17.
 */

import ExternalApiService from './externalApi';
import InternalApiService from './internalApi';

it('should retrieve a list of notifications', () => {
  global.fetch = jest.fn();
  global.fetch.mockReturnValue(new Promise((resolve,reject)=>{
    resolve({json: ()=>{return {data: {}}}})}));
  const testService = new ExternalApiService('', new InternalApiService(''));
  testService.getNotifications();
  expect(fetch.mock.calls.length).toBe(1);
});

it('should send a notification', () => {
  global.fetch = jest.fn();
  global.fetch.mockReturnValue(new Promise((resolve,reject)=>{
    resolve({json: ()=>{return {data: {}}}})}));
  const testService = new ExternalApiService('', new InternalApiService(''));
  testService.sendNotification('','','','');
  expect(fetch.mock.calls.length).toBe(1);
});

it('should get a directory entry for a specified building & unit', () => {
  global.fetch = jest.fn();
  global.fetch.mockReturnValue(new Promise((resolve,reject)=>{
    resolve({json: ()=>{return {data: {}}}})}));
  const testService = new ExternalApiService('', new InternalApiService(''));
  testService.getDirectoryEntry('','');
  expect(fetch.mock.calls.length).toBe(1);
});

it('should set a directory entry for a specified building & unit', () => {
  global.fetch = jest.fn();
  global.fetch.mockReturnValue(new Promise((resolve,reject)=>{
    resolve({json: ()=>{return {data: {}}}})}));
  const testService = new ExternalApiService('', new InternalApiService(''));
  testService.setDirectoryEntry('','','');
  expect(fetch.mock.calls.length).toBe(1);
});