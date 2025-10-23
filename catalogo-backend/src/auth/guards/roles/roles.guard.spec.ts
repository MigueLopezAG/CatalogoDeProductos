import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RolesGuard } from './roles.guard';

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  describe('canActivate', () => {
    it('should return true if no roles are required', () => {
      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const mockGqlContext = {
        getContext: jest.fn().mockReturnValue({ req: { user: { role: Role.USER } } }),
      };
      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext as any);

      const result = guard.canActivate(mockContext as any);

      expect(result).toBe(true);
    });

    it('should return true if user has required role', () => {

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      const mockGqlContext = {
        getContext: jest.fn().mockReturnValue({ req: { user: { role: Role.ADMIN } } }),
      };
      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext as any);

      const result = guard.canActivate(mockContext as any);

      expect(result).toBe(true);
    });

    it('should return false if user does not have required role', () => {

      const mockContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
      };
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      const mockGqlContext = {
        getContext: jest.fn().mockReturnValue({ req: { user: { role: Role.USER } } }),
      };
      jest.spyOn(GqlExecutionContext, 'create').mockReturnValue(mockGqlContext as any);

      const result = guard.canActivate(mockContext as any);

      expect(result).toBe(false);
    });
  });
});