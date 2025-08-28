import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ReadReceiptIndicator from '../ReadReceiptIndicator';

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('ReadReceiptIndicator', () => {
  it('should render sent status with single check icon', () => {
    renderWithTheme(<ReadReceiptIndicator status="sent" />);
    
    expect(screen.getByTestId('CheckIcon')).toBeInTheDocument();
    expect(screen.getByText('Sent')).toBeInTheDocument();
  });

  it('should render delivered status with double check icon', () => {
    renderWithTheme(<ReadReceiptIndicator status="delivered" />);
    
    expect(screen.getByTestId('DoneAllIcon')).toBeInTheDocument();
    expect(screen.getByText('Delivered')).toBeInTheDocument();
  });

  it('should render read status with colored double check icon', () => {
    renderWithTheme(<ReadReceiptIndicator status="read" />);
    
    const icon = screen.getByTestId('DoneAllIcon');
    expect(icon).toBeInTheDocument();
    expect(screen.getByText('Read')).toBeInTheDocument();
    
    // Check that the read status has primary color styling
    const readText = screen.getByText('Read');
    expect(readText).toHaveStyle({ color: 'rgb(25, 118, 210)' }); // MUI primary color
  });

  it('should render timestamp when provided', () => {
    renderWithTheme(<ReadReceiptIndicator status="read" timestamp="10:30 AM" />);
    
    expect(screen.getByText('10:30 AM')).toBeInTheDocument();
    expect(screen.queryByText('Read')).not.toBeInTheDocument();
  });

  it('should render nothing for invalid status', () => {
    const { container } = renderWithTheme(<ReadReceiptIndicator status="invalid" />);
    
    expect(container.firstChild.children).toHaveLength(1); // Only the text element
    expect(screen.queryByTestId('CheckIcon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('DoneAllIcon')).not.toBeInTheDocument();
  });

  it('should have proper styling for different statuses', () => {
    const { rerender } = renderWithTheme(<ReadReceiptIndicator status="sent" />);
    
    let icon = screen.getByTestId('CheckIcon');
    expect(icon).toHaveStyle({ opacity: '0.6' });
    
    rerender(
      <ThemeProvider theme={theme}>
        <ReadReceiptIndicator status="delivered" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('DoneAllIcon');
    expect(icon).toHaveStyle({ opacity: '0.6' });
    
    rerender(
      <ThemeProvider theme={theme}>
        <ReadReceiptIndicator status="read" />
      </ThemeProvider>
    );
    
    icon = screen.getByTestId('DoneAllIcon');
    expect(icon).toHaveStyle({ color: 'rgb(25, 118, 210)' }); // Primary color
  });
});