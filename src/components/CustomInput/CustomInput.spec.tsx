import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CustomInput } from './CustomInput';
import { Currencies } from '../../enums/currencies.enum';

describe('CustomInput component', () => {
  const onChangeMock = vi.fn();
  const props = {
    value: '15',
    onChange: onChangeMock,
    currency: Currencies.USTD,
    min: 0,
    max: 100,
    step: 15,
    decimalLimit: 2,
    disabled: false,
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('prevents entering empty value', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    const input = getByRole('textbox');
    userEvent.clear(input);
    expect(onChangeMock).not.toHaveBeenCalledWith('');
  });

  it('prevents entering non-numeric characters', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    const input = getByRole('textbox');
    userEvent.type(input, 'abc');
    expect(onChangeMock).not.toHaveBeenCalledWith('abc');
  });

  it('prevents entering values outside the range', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    const input = getByRole('textbox');
    userEvent.clear(input);
    userEvent.type(input, '-1');
    expect(onChangeMock).not.toHaveBeenCalledWith('-1');
    userEvent.clear(input);
    userEvent.type(input, '101');
    expect(onChangeMock).not.toHaveBeenCalledWith('101');
  });

  it('prevents entering more decimal places than allowed', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    const input = getByRole('textbox');
    userEvent.clear(input);
    userEvent.type(input, '1.123');
    expect(onChangeMock).not.toHaveBeenCalledWith('1.123');
  });

  it('handles arrow up key correctly', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    const input = getByRole('textbox') as HTMLInputElement;
    console.log('Initial Value:', input.value); 
  
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    console.log('Value after ArrowUp:', input.value); 
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('30');

  });

  it('handles arrow down key correctly', () => {
    const { getByRole } = render(<CustomInput {...props} />);
    const input = getByRole('textbox') as HTMLInputElement;
    console.log('Initial Value:', input.value); 
  
  
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    console.log('Value after ArrowDown:', input.value);
    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith('0');
  });

  it('prevents entering comma when decimalLimit is null', () => {
    const localProps = { ...props, decimalLimit: null };
    const { getByRole } = render(<CustomInput {...localProps} />);
    const input = getByRole('textbox');
    userEvent.type(input, ',');
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('prevents entering comma when value already contains decimal point', () => {
    const localProps = { ...props, value: '1.0' };
    const { getByRole } = render(<CustomInput {...localProps} />);
    const input = getByRole('textbox');
    userEvent.type(input, ',');
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    const localProps = { ...props, disabled: true };
    const { getByRole } = render(<CustomInput {...localProps} />);
    const input = getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
