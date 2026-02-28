pub mod domain {
    #[derive(Debug, Clone)]
    pub struct Workspace {
        pub id: String,
        pub name: String,
        pub path: String,
    }
}
