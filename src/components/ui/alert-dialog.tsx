import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, children, ...props }, ref) => {
  // Generate unique IDs for accessibility
  const titleId = React.useId();
  const descriptionId = React.useId();
  
  // Analyze children to find title and description
  const childArray = React.Children.toArray(children);
  
  // Check for AlertDialogTitle component
  const hasAlertDialogTitle = childArray.some(child => {
    if (!React.isValidElement(child)) return false;
    
    // Direct AlertDialogTitle
    if (child.type === AlertDialogTitle) return true;
    
    // AlertDialogTitle inside AlertDialogHeader
    if (child.type === AlertDialogHeader && child.props.children) {
      const headerChildren = React.Children.toArray(child.props.children);
      return headerChildren.some(headerChild => 
        React.isValidElement(headerChild) && headerChild.type === AlertDialogTitle
      );
    }
    
    // Check for nested components that might contain AlertDialogTitle
    if (child.props && child.props.children) {
      const nestedChildren = React.Children.toArray(child.props.children);
      return nestedChildren.some(nestedChild => 
        React.isValidElement(nestedChild) && 
        (nestedChild.type === AlertDialogTitle || 
         (nestedChild.type === AlertDialogHeader && 
          React.Children.toArray(nestedChild.props?.children || []).some(
            headerChild => React.isValidElement(headerChild) && headerChild.type === AlertDialogTitle
          ))
        )
      );
    }
    
    return false;
  });
  
  // Check for AlertDialogDescription component
  const hasAlertDialogDescription = childArray.some(child => {
    if (!React.isValidElement(child)) return false;
    
    // Direct AlertDialogDescription
    if (child.type === AlertDialogDescription) return true;
    
    // AlertDialogDescription inside AlertDialogHeader
    if (child.type === AlertDialogHeader && child.props.children) {
      const headerChildren = React.Children.toArray(child.props.children);
      return headerChildren.some(headerChild => 
        React.isValidElement(headerChild) && headerChild.type === AlertDialogDescription
      );
    }
    
    // Check for nested components that might contain AlertDialogDescription
    if (child.props && child.props.children) {
      const nestedChildren = React.Children.toArray(child.props.children);
      return nestedChildren.some(nestedChild => 
        React.isValidElement(nestedChild) && 
        (nestedChild.type === AlertDialogDescription || 
         (nestedChild.type === AlertDialogHeader && 
          React.Children.toArray(nestedChild.props?.children || []).some(
            headerChild => React.isValidElement(headerChild) && headerChild.type === AlertDialogDescription
          ))
        )
      );
    }
    
    return false;
  });
  
  // Create a VisuallyHidden component for accessibility
  const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
    <span
      className="absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden whitespace-nowrap border-0"
    >
      {children}
    </span>
  );

  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        aria-labelledby={titleId}
        aria-describedby={hasAlertDialogDescription ? descriptionId : undefined}
        {...props}
      >
        {!hasAlertDialogTitle && (
          <VisuallyHidden>
            <AlertDialogTitle id={titleId}>Alert Dialog</AlertDialogTitle>
          </VisuallyHidden>
        )}
        
        {!hasAlertDialogDescription && (
          <VisuallyHidden>
            <AlertDialogDescription id={descriptionId}>Alert dialog content</AlertDialogDescription>
          </VisuallyHidden>
        )}
        
{children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  );
})
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
