/* eslint-disable @typescript-eslint/unbound-method */
import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtGuard } from './jwt.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtGuard;

  beforeEach(() => {
    guard = new JwtGuard();
  });

  describe('getRequest', () => {
    it('should return request from GraphQL context', () => {
      
      const mockRequest = { headers: {} };
      const mockContext = {
        getContext: jest.fn().mockReturnValue({ req: mockRequest }),
      };
      const mockExecutionContext = {
        switchToHttp: jest.fn(),
      } as unknown as ExecutionContext;

      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockContext as any);

      
      const result = guard.getRequest(mockExecutionContext);

      
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(mockExecutionContext);
      expect(result).toBe(mockRequest);
    });
  });
});