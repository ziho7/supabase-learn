'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SubmitButton } from '@/components/submit-button'
import { useEffect, useState } from 'react'
import supabase, { Book, createBook, getBooks, updateBook, deleteBook } from '@/lib/supabase'



// type Book = {
//     id?: string
//     name: string
//     author: string
//     introduction: string
//     count: number
// }


export default function Page() {

    const [books, setBooks] = useState<Book[]>([])

    const [newBook, setNewBook] = useState<Book>({
        name: '',
        author: '',
        introduction: '',
        count: 0
    })

    const fetchBooks = async () => {
        const books = await getBooks()
        setBooks(books)
    }


    useEffect(() => {
        fetchBooks()
    }, [])

    const channelA = supabase
        .channel('schema-db-changes')
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'books'
            },
            (payload) => console.log(payload)
        )
        .subscribe()


    return (
        <div>
            <div className="mb-8 flex items-end gap-4 max-w-3xl">
                <div className="flex flex-col w-1/4 gap-2 min-w-32">
                    <Label htmlFor="name">书名</Label>
                    <Input name="name" id="name" required value={newBook.name} onChange={(e) => setNewBook({ ...newBook, name: e.target.value })} />
                </div>
                <div className="flex flex-col w-1/4 gap-2 min-w-32">
                    <Label htmlFor="author">作者</Label>
                    <Input name="author" id="author" required value={newBook.author} onChange={(e) => setNewBook({ ...newBook, author: e.target.value })} />
                </div>
                <div className="flex flex-col w-2/4 gap-2 min-w-40">
                    <Label htmlFor="introduction">简介</Label>
                    <Input name="introduction" id="introduction" required value={newBook.introduction} onChange={(e) => setNewBook({ ...newBook, introduction: e.target.value })} />
                </div>
                <div className="flex flex-col w-1/4 gap-2 min-w-32">
                    <Label htmlFor="count">数量</Label>
                    <Input name="count" id="count" required value={newBook.count} onChange={(e) => setNewBook({ ...newBook, count: parseInt(e.target.value) })} />
                </div>
                <SubmitButton
                    pendingText="创建中..."
                    type="submit"
                    onClick={async () => {
                        await createBook(newBook)
                        setNewBook({
                            name: '',
                            author: '',
                            introduction: '',
                            count: 0
                        })
                        await fetchBooks()
                    }}>
                    创建书籍
                </SubmitButton>
            </div>
            {/* 列表内容 */}
            {books?.map((book) => (
                <BookItem key={book.id} book={book} fetchBooks={fetchBooks} />
            ))}
        </div>
    )
    function BookItem({ book, fetchBooks }: { book: Book, fetchBooks: () => Promise<void> }) {
        return (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow p-4 mb-3">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 min-w-0 w-[8em]">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{book.name}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0 w-[6em]">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{book.author}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0 flex-1">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[16em]">{book.introduction}</span>
                    </div>
                    <div className="flex items-center gap-1 min-w-0 w-[6em]">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{book.count}</span>
                    </div>
                    <button
                        className="ml-6 px-3 py-1 text-xs rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                        onClick={async () => {
                            await updateBook({ ...book, count: book.count - 1 })
                            await fetchBooks()
                        }}
                    >借阅</button>
                    <button
                        className="ml-2 px-3 py-1 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                        onClick={async () => {
                            await deleteBook(book.id!)
                            await fetchBooks()
                        }}
                    >删除</button>
                </div>
            </div>
        )
    }
}