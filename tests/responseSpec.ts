import { Response } from '../src/response'

describe('Response', function() {
  // beforeEach(async done => {
  //   await someOp()
  //   done()
  // })

  it('should create error with status 400', done => {
    const expectedStatus = 400
    const expectedErrorMessage = 'This is an error'

    const response = new Response({}, { message: expectedErrorMessage })

    expect(expectedErrorMessage).toEqual(response.body)
    expect(expectedStatus).toEqual(response.statusCode)
    done()
  })
})
