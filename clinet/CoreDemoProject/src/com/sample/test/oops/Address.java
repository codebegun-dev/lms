package com.sample.test.oops;

public interface Address {
     void city();
}
interface Address1{
	void city();
}
class Area implements Address,Address1{
	public void city() {
		System.out.println("Vijayawada");
	}
	public static void main(String args[]) {
		Area  area =new Area();
		area.city();
}
}
