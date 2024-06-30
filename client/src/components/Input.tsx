import { InputHTMLAttributes, forwardRef } from 'react'
import cn from 'classnames'

//uses forwardRef to forward the ref to the underlying input element,
//allows the parent components to access and manipulate input element
//directly
export const Input = forwardRef<
//ensures ref is compatible with the input elements expected type
  HTMLInputElement,
  //specifies the type of props object the component accepts
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...rest }, ref) => {
  return (
    <input
      {...rest}
      //ref is assigned to the underlaying input element using the
      //ref attribute, enableing parent component to reference input elemnt
      ref={ref}
      className={cn(
        'w-full px-5 py-2 bg-transparent border-2 outline-none border-zinc-600 rounded-xl placeholder:text-zinc-500 focus:border-white',
        className,
      )}
    />
  )
})