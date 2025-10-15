export default function AppSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className='mt-8 text-center'>
            <h2 className='text-2xl font-bold mb-4'>{title}</h2>
            {children}
        </section>
    )
}