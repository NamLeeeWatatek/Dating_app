export class SuccessResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T;

  constructor(data?: T, message?: string) {
    this.success = true;
    this.message = message || 'Request successful';
    this.data = data;
  }
}
