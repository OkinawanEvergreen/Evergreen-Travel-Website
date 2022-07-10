package com.snhu.evergreentravelapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication /*Annotation of "SpringBootApplication" is a convenience annotation that adds all the following:
						- @Configuration - Tags the class as a source of bean definitions for the application context
						- @Enable AutoConfiguration - Tells Spring Boot to start adding beans based on class path, settings, other beans, and property settings.
						- @ComponentScan - Tells Spring to look for other components, configurations, and services in com/evergreentravelapp package, letting it find other controllers*/


public class TravelAppApplication { 

	public static void main(String[] args) {
		SpringApplication.run(TravelAppApplication.class, args); //Runs the TravelAppApplication through the SpringApplication
	}

	


}
