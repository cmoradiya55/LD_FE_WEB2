import Link, { LinkProps } from 'next/link';
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  forwardRef,
  ReactNode,
  Ref,
} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

type ButtonBaseProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

type ButtonLinkProps = ButtonBaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> &
  Omit<LinkProps, 'href'> & {
    href: LinkProps['href'];
  };

type ButtonNativeProps = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

export type ButtonProps = ButtonLinkProps | ButtonNativeProps;

const baseClasses =
  'inline-flex items-center justify-center rounded-xl font-semibold text-xs transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-400 disabled:opacity-50 disabled:pointer-events-none shadow-sm hover:shadow-md active:scale-[0.98]';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'text-white p-2 bg-gradient-to-r from-[var(--color-gradient-from)] via-[var(--color-gradient-from)] to-[var(--color-gradient-to)]',
  secondary:
    'bg-white p-2 text-primary-700 border border-gray-200 hover:border-primary-400 hover:bg-primary-50',
  ghost: 'text-gray-700 p-2 hover:bg-gray-100/80',
  outline: 'bg-white text-blue-700 hover:text-blue-900 backdrop-blur-sm border border-blue-700 shadow-sm hover:bg-blue-50 transition-colors px-3 py-2 rounded-full flex items-center gap-1.5 text-xs mb-4 disabled:opacity-50 disabled:pointer-events-none',
};

const cn = (...classes: Array<string | false | undefined | null>) =>
  classes.filter(Boolean).join(' ');

export const buttonVariants = ({
  variant = 'primary',
  size = 'xs',
  className,
}: {
  variant?: ButtonVariant;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
} = {}) => cn(baseClasses, variantClasses[variant], className);

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(props, ref) {
  const className = buttonVariants({
    variant: props.variant,
    className: props.className,
  });

  if ('href' in props && props.href !== undefined) {
    const { variant: _variant, className: _className, children, href, ...linkProps } =
      props as ButtonLinkProps;

    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={className}
        {...linkProps}
      >
        {children}
      </Link>
    );
  }

  const {
    variant: _variant,
    className: _className,
    children,
    href: _href,
    type,
    ...buttonProps
  } = props as ButtonNativeProps;

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      className={className}
      type={type ?? 'button'}
      {...buttonProps}
    >
      {children}
    </button>
  );
});


