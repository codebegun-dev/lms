package com.sample.test.oops;

public class Book {
	String title;
	String author;
	long price;
	 public Book(String title,String author,long price) {
		this.title=title;
		this.author=author;
		this.price=price;
		 }
 void title() {
	 System.out.println("This is the title " +title);
 }
 void author() {
	 System.out.println("This is the author " +author);
 }
 void price() {
	 System.out.println("This is the price " +price);
 }

public static void main(String args[]) {
	Book book=new Book("Zero","Aryabatta",634637);
	book.author();
	book.title();
	book.price();
}
}
