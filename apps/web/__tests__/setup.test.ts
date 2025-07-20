/**
 * Basic setup test to verify Jest configuration works
 */

describe('Test Setup', () => {
  test('Jest is working', () => {
    expect(1 + 1).toBe(2);
  });

  test('Environment is configured', () => {
    expect(typeof window).toBe('object');
    expect(typeof document).toBe('object');
  });

  test('Mocks are working', () => {
    const mockFn = jest.fn();
    mockFn('test');
    expect(mockFn).toHaveBeenCalledWith('test');
  });
});
