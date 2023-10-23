const createMockTestSuite = () => {
    const mockSend = jest.fn();
    const mockStatus = jest.fn().mockReturnThis();
    const mockRes = { status: mockStatus, send: mockSend };
    return {
        mockStatus,
        mockRes,
        mockSend
    }
}

export default createMockTestSuite;