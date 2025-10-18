// Validation utilities for better form validation and user feedback

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class ValidationUtils {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validatePrice(price: string | number): boolean {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return !isNaN(numPrice) && numPrice > 0;
  }

  static validateRequired(value: string | number | undefined | null): boolean {
    if (typeof value === 'string') {
      return value.trim().length > 0;
    }
    return value !== undefined && value !== null;
  }

  static validateMinLength(value: string, minLength: number): boolean {
    return value.length >= minLength;
  }

  static validateMaxLength(value: string, maxLength: number): boolean {
    return value.length <= maxLength;
  }

  static validateRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static validateZipCode(zipCode: string): boolean {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    return zipRegex.test(zipCode);
  }

  static validatePropertyData(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate title
    if (!this.validateRequired(data.title)) {
      errors.title = 'Title is required';
    } else if (!this.validateMinLength(data.title, 3)) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (!this.validateMaxLength(data.title, 200)) {
      errors.title = 'Title must be less than 200 characters';
    }

    // Validate description
    if (!this.validateRequired(data.description)) {
      errors.description = 'Description is required';
    } else if (!this.validateMinLength(data.description, 10)) {
      errors.description = 'Description must be at least 10 characters long';
    }

    // Validate price
    if (!this.validateRequired(data.price)) {
      errors.price = 'Price is required';
    } else if (!this.validatePrice(data.price)) {
      errors.price = 'Price must be a valid positive number';
    }

    // Validate address
    if (!this.validateRequired(data.address)) {
      errors.address = 'Address is required';
    }

    // Validate city
    if (!this.validateRequired(data.city)) {
      errors.city = 'City is required';
    }

    // Validate state
    if (!this.validateRequired(data.state)) {
      errors.state = 'State is required';
    }

    // Validate zip code
    if (!this.validateRequired(data.zipCode)) {
      errors.zipCode = 'ZIP code is required';
    } else if (!this.validateZipCode(data.zipCode)) {
      errors.zipCode = 'ZIP code must be in format 12345 or 12345-6789';
    }

    // Validate bedrooms
    if (!this.validateRequired(data.bedrooms)) {
      errors.bedrooms = 'Number of bedrooms is required';
    } else if (!this.validateRange(data.bedrooms, 1, 20)) {
      errors.bedrooms = 'Number of bedrooms must be between 1 and 20';
    }

    // Validate bathrooms
    if (!this.validateRequired(data.bathrooms)) {
      errors.bathrooms = 'Number of bathrooms is required';
    } else if (!this.validateRange(data.bathrooms, 1, 20)) {
      errors.bathrooms = 'Number of bathrooms must be between 1 and 20';
    }

    // Validate square feet
    if (!this.validateRequired(data.squareFeet)) {
      errors.squareFeet = 'Square footage is required';
    } else if (!this.validateRange(data.squareFeet, 100, 100000)) {
      errors.squareFeet = 'Square footage must be between 100 and 100,000';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateCustomerData(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    // Validate first name
    if (!this.validateRequired(data.firstName)) {
      errors.firstName = 'First name is required';
    } else if (!this.validateMinLength(data.firstName, 2)) {
      errors.firstName = 'First name must be at least 2 characters long';
    }

    // Validate last name
    if (!this.validateRequired(data.lastName)) {
      errors.lastName = 'Last name is required';
    } else if (!this.validateMinLength(data.lastName, 2)) {
      errors.lastName = 'Last name must be at least 2 characters long';
    }

    // Validate email
    if (!this.validateRequired(data.email)) {
      errors.email = 'Email is required';
    } else if (!this.validateEmail(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Validate phone (optional)
    if (data.phone && !this.validatePhone(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static formatPrice(price: number | string | undefined): string {
    if (price === undefined || price === null) return 'N/A';
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numPrice)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numPrice);
  }

  static formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  }
}
