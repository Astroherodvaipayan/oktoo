// const WrapperRefresh = ({ children }) => {
//   const { authenticate } = useOkto();
//   const { googleIdToken } = useAuthenticationStore();
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!googleIdToken) {
//       return () => {};
//     }
//     setIsLoading(true);
//     authenticate(googleIdToken, async (authResponse, error) => {
//       setIsLoading(false);
//       if (authResponse) {
//         console.log('Authentication check: ', authResponse);
//       }

//       if (error) {
//         console.error('Authentication error:', error);
//       } else {
//         setIsLoading(false);
//       }
//     });
//   }, [googleIdToken]);

//   if (isLoading) {
//     return <AllPageLoaderContent />;
//   }
//   return children;
// };

const AppLayout = ({ children }) => {
  return children;
  // return <WrapperRefresh>{children}</WrapperRefresh>;
};

export default AppLayout;
