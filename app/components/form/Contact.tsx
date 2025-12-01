"use client";

import { Send, MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { type FormState, submitContactForm } from "./action";
import { useActionState, ViewTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Contact() {
  const [currentState, formAction, isPending] = useActionState<
    FormState,
    FormData
  >(submitContactForm, {});

  const handleSubmit = async (e: any) => {
    // e.preventDefault();
    // setIsSending(true);
    // setSendStatus(null);
    // try {
    //   await SendEmail({
    //     to: "mikewon98@gmail.com",
    //     subject: `Portfolio Contact: ${formData.subject}`,
    //     body: `From: ${formData.name} (${formData.email})\n\n${formData.message}`,
    //   });
    //   setSendStatus("success");
    //   setFormData({ name: "", email: "", subject: "", message: "" });
    // } catch (error) {
    //   setSendStatus("error");
    // }
    // setIsSending(false);
  };

  return (
    <div id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-green-600 to-green-400 dark:from-purple-500 dark:to-purple-300 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Let's discuss your next project
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700 flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Email
                  </h4>
                  <a
                    href="mailto:mikewon98@gmail.com"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-purple-400 transition-colors"
                  >
                    mikewon98@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700 flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Phone
                  </h4>
                  <a
                    href="tel:+251923974353"
                    className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-purple-400 transition-colors"
                  >
                    (+251) 923 974 353
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-r from-green-400 to-green-600 dark:from-purple-500 dark:to-purple-700 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Location
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 glass rounded-2xl">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                Let's Connect
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                I'm always open to discussing new projects, creative ideas, or
                opportunities to be part of your vision.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form
              action={formAction}
              className="glass rounded-2xl p-8 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <Input
                  required
                  id="name"
                  name="name"
                  type="text"
                  disabled={isPending}
                  placeholder="Your name"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <Input
                  required
                  id="email"
                  name="email"
                  type="email"
                  disabled={isPending}
                  placeholder="your.email@example.com"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <Input
                  required
                  id="subject"
                  name="subject"
                  type="text"
                  disabled={isPending}
                  placeholder="What's this about?"
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <Textarea
                  required
                  id="message"
                  name="message"
                  disabled={isPending}
                  placeholder="Tell me about your project..."
                  rows={5}
                  className="bg-white/50 dark:bg-gray-800/50"
                />
              </div>

              {currentState.success && currentState.message && (
                <ViewTransition>
                  <p className="text-center text-sm text-green-600">
                    ✓ {currentState.message}
                  </p>
                </ViewTransition>
              )}

              {currentState.error && (
                <ViewTransition>
                  <p className="text-center text-sm text-red-600">
                    {currentState.error}
                  </p>
                </ViewTransition>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-linear-to-r from-green-600 to-green-500 dark:from-purple-600 dark:to-purple-500 hover:opacity-90 hover:cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
