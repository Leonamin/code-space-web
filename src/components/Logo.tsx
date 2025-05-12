const Logo: React.FC = ({size}: {
    size?: string
}) => {
    return (
        <img src="/logo.png" alt="logo" width={size}/>
    )
}

export default Logo