function useSidebar(){
    const isOpen = useState('sidebar',()=>false)

    const toggleSidebar = ()=>{
        isOpen.value = !isOpen.value
    }

    return{
        isOpen,
        toggleSidebar
    }
}
export default useSidebar